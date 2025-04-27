from flask import Flask, render_template, url_for

app = Flask(__name__, static_folder="static", template_folder="templates")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/origins')
def origins():
    return render_template('origins.html')

@app.route('/merch')
def merch():
    return render_template('merch.html')

if __name__ == '__main__':
    app.run(debug=True)