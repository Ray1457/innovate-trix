from flask import Flask, render_template, url_for, session, jsonify, request    
import json, os
import stripe



with open('static/data/merch.json') as f:
    merch_data = json.load(f)
with open('static/data/food.json') as f:
    food_data = json.load(f)

food_items = []
categories = set()
for (key, item) in food_data.items():
    food_items.append({
        'id': key,
        'name': item['name'],
        'description': item['description'],
        'price': item['price'],
        'image_url': item['image_url'],
        'rating': item['rating'],
        'category': item['category'],
        'special': item['special']
    })
    categories.add(item['category'])
categories = list(categories)

food_items = sorted(
    food_items,
    key=lambda x: (not x['special'], x['name'].lower())
)



merch_items = []
for (key, item) in merch_data.items():
    merch_items.append({
        'id': key,
        'name': item['name'],
        'price': item['price'],
        'image_url': item['image_url'],
    })


app = Flask(__name__, static_folder="static", template_folder="templates")
app.secret_key = 'RAY'


app.config['STRIPE_SECRET_KEY'] = 'sk_test_51MMRkOSEzPBlgs1CJdlZhhC2OCxiFs74QjzGnPWhP7ardKmClTYvbOakK3JRSs0erzLNxIpvWxL2KfBZ4gINAd3q003ReAG2bm'
app.config['STRIPE_PUBLISHABLE_KEY'] = 'pk_test_51MMRkOSEzPBlgs1Ck16EBWSuxXEjbbbOKRtsACj65hPmP2B2gfy1BeWYGsfOxp60IyZM7A40h8tJzTbgCHr1vVeC00kwxztzSQ'


stripe.api_key = app.config['STRIPE_SECRET_KEY']

@app.route('/')
def home():
    print(merch_data)
    return render_template('index.html')

@app.route('/origins')
def origins():
    return render_template('origins.html')

@app.route('/merch')
def merch():
    return render_template('merch.html')

@app.route('/menu')
def menu():
    return render_template('menu.html', food_items=food_items, categories=categories)


@app.route('/cart')
def cart():
    cart = session.get('cart', {'food_cart': {}, 'merch_cart': {}})
    food_cart = cart.get('food_cart', {})
    merch_cart = cart.get('merch_cart', {})
    
    # Prepare food items
    food_items = []
    for (item_id, quantity) in food_cart.items():
        food_item = food_data.get(item_id)
        if food_item:
            food_items.append({
                'id': item_id,
                'name': food_item['name'],
                'price': food_item['price'],
                'quantity': quantity,
                'image_url': food_item['image_url']
            })
    
    # Prepare merch items
    merch_items = []
    for (item_id, quantity) in merch_cart.items():
        merch_item = merch_data.get(item_id)
        if merch_item:
            merch_items.append({
                'id': item_id,
                'name': merch_item['name'],
                'price': merch_item['price'],
                'quantity': quantity,
                'image_url': merch_item['image_url']
            })
    
    # Pricing
    tax_rate = 0.18
    shipping_cost = 4.99

    # Food calculations
    food_subtotal = sum(item['price'] * item['quantity'] for item in food_items)
    food_taxes = round(food_subtotal * tax_rate, 2)
    food_shipping = shipping_cost if food_items else 0
    food_total = round(food_subtotal + food_taxes + food_shipping, 2)

    # Merch calculations
    merch_subtotal = sum(item['price'] * item['quantity'] for item in merch_items)
    merch_taxes = round(merch_subtotal * tax_rate, 2)
    merch_shipping = shipping_cost if merch_items else 0
    merch_total = round(merch_subtotal + merch_taxes + merch_shipping, 2)
    
    return render_template('cart.html',
        merch_items=merch_items,
        merch_subtotal=merch_subtotal,
        merch_taxes=merch_taxes,
        merch_shipping=merch_shipping,
        merch_total=merch_total,
        food_items=food_items,
        food_subtotal=food_subtotal,
        food_taxes=food_taxes,
        food_shipping=food_shipping,
        food_total=food_total
    )




# Utility to initialize cart if not present
def get_cart():
    if 'cart' not in session:
        session['cart'] = {'food_cart': {}, 'merch_cart': {}}
    return session['cart']

# -------- MERCH CART --------

@app.route('/merch/add/<int:item_id>', methods=['POST'])
def add_merch(item_id):
    cart = get_cart()
    item_id = str(item_id)
    cart['merch_cart'][item_id] = cart['merch_cart'].get(item_id, 0) + 1
    session['cart'] = cart
    return jsonify({'success': True, 'merch_cart': cart['merch_cart']}), 200

@app.route('/merch/remove/<int:item_id>', methods=['POST'])
def remove_merch(item_id):
    cart = get_cart()
    item_id = str(item_id)
    if item_id in cart['merch_cart']:
        cart['merch_cart'][item_id] -= 1
        if cart['merch_cart'][item_id] <= 0:
            del cart['merch_cart'][item_id]
        session['cart'] = cart
    return jsonify({'success': True, 'merch_cart': cart['merch_cart']}), 200

# -------- FOOD CART --------

@app.route('/food/add/<int:item_id>', methods=['POST'])
def add_food(item_id):
    cart = get_cart()
    item_id = str(item_id)
    cart['food_cart'][item_id] = cart['food_cart'].get(item_id, 0) + 1
    session['cart'] = cart
    return jsonify({'success': True, 'food_cart': cart['food_cart']}), 200

@app.route('/food/remove/<int:item_id>', methods=['POST'])
def remove_food(item_id):
    cart = get_cart()
    item_id = str(item_id)
    if item_id in cart['food_cart']:
        cart['food_cart'][item_id] -= 1
        if cart['food_cart'][item_id] <= 0:
            del cart['food_cart'][item_id]
        session['cart'] = cart
    return jsonify({'success': True, 'food_cart': cart['food_cart']}), 200


@app.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    cart_type = request.json.get('cart_type')  # 'food_cart' or 'merch_cart'
    cart = request.json.get('cart', {})

    # Determine which set of items to pull from based on cart_type
    items = food_items if cart_type == 'food_cart' else merch_items
    line_items = []

    subtotal = 0

    for item_id, quantity in cart.items():
        product = None
        for item in items:
            if item['id'] == item_id:
                product = {
                    'name': item['name'],
                    'image': url_for('static', filename=item['image_url'].replace("static/", ""), _external=True),
                    'price': item['price']
                }
                break
        if product:
            subtotal += int(product['price']*100) * quantity
            line_items.append({
                'price_data': {
                    'currency': "usd",
                    'product_data': {
                        'name': product['name'],
                        'images': [product['image']],
                    },
                    'unit_amount': int(product['price']*100),
                },
                'quantity': quantity,
            })
        else:
            return jsonify({"error": f"Product with ID {item_id} not found."}), 400

    

    # Add tax (18%)
    tax_amount = int(subtotal * 0.18)

    line_items.append({
        'price_data': {
            'currency': 'usd',
            'product_data': {
                'name': 'GST (18%)'
            },
            'unit_amount': tax_amount
        },
        'quantity': 1,
    })

    line_items.append({
        'price_data': {
            'currency': 'usd',
            'product_data': {
                'name': 'Shipping'
            },
            'unit_amount': 499  # $5
        },
        'quantity': 1,
    })

    if not line_items:
        return jsonify({"error": "Cart is empty."}), 400

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=url_for('checkout_success', _external=True),
            cancel_url=url_for('checkout_cancel', _external=True),
        )
        return jsonify({'url': session.url})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/success")
def checkout_success():
    # Clear the cart after successful payment
    session.pop('cart', None)
    return render_template('success.html')

@app.route("/cancel")
def checkout_cancel():
    return "Payment cancelled."

if __name__ == "__main__":
    # app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    app.run(debug=True, port=5000)
