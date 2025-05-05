function filterCategory(category) {
    const allItems = document.querySelectorAll('.grid > div');
    allItems.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });

    // Highlight the active button
    const buttons = document.querySelectorAll('[data-category]');
    buttons.forEach(button => {
        if (button.getAttribute('data-category') === category) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

addEventListener('DOMContentLoaded', () => {
const carousel = document.getElementById('carousel');
  const dots = document.querySelectorAll('.dot');
  let index = 0;
  const total = 3;

  function updateCarousel() {
    carousel.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((dot, i) => {
      dot.classList.toggle('opacity-100', i === index);
      dot.classList.toggle('opacity-50', i !== index);
    });
  }

  document.getElementById('prev').addEventListener('click', () => {
    index = (index - 1 + total) % total;
    updateCarousel();
  });

  document.getElementById('next').addEventListener('click', () => {
    index = (index + 1) % total;
    updateCarousel();
  });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      index = parseInt(dot.dataset.index);
      updateCarousel();
    });
  });

  updateCarousel(); // Initial state
});