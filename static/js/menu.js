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


    // const grid = document.querySelector(".grid");
    // if (grid) {
    //     grid.scrollIntoView({ behavior: "smooth", block: "start" });
    // }

    AOS.refresh(); // Refresh AOS after DOM changes
}

addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('carousel');
    const dots = document.querySelectorAll('.dot');
    let index = 0;
    const total = dots.length;
  
    function updateCarousel() {
      carousel.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle('opacity-100', i === index);
        dot.classList.toggle('opacity-50', i !== index);
      });
    }
  
    function nextSlide() {
      index = (index + 1) % total;
      updateCarousel();
    }
  
    function prevSlide() {
      index = (index - 1 + total) % total;
      updateCarousel();
    }
  
    document.getElementById('prev').addEventListener('click', () => {
      prevSlide();
      resetAutoSlide();
    });
  
    document.getElementById('next').addEventListener('click', () => {
      nextSlide();
      resetAutoSlide();
    });
  
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        index = parseInt(dot.dataset.index);
        updateCarousel();
        resetAutoSlide();
      });
    });
  
    updateCarousel(); // Initial state
  
    // Auto-slide every 5 seconds
    let autoSlide = setInterval(nextSlide, 3000);
  
    // Reset timer when user interacts
    function resetAutoSlide() {
      clearInterval(autoSlide);
      autoSlide = setInterval(nextSlide, 2000);
    }
});


