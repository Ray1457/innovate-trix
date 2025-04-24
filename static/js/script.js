//nav scrolling 

window.addEventListener('scroll', function () {
    const hiddenNav = document.querySelector('.nav-hidden'); // Select the hidden nav
    if (window.scrollY > 500) {
        hiddenNav.classList.add('nav-visible'); // Add the visible class
    } else {
        hiddenNav.classList.remove('nav-visible'); // Remove the visible class
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const isFirstVisit = !sessionStorage.getItem('visited');
  const loader = document.getElementById('loader');

  if (isFirstVisit) {
    // First visit: show loader briefly
    loader.style.display = 'block'; // Show the loader
    sessionStorage.setItem('visited', 'true');
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.body.classList.add('loaded');
        document.getElementById('main-content').style.display = 'block';
        loader.style.display = 'none'; // Hide the loader
      }, 2200); // Delay to show loader
    });
  } else {
    // Internal redirect: skip loader
    document.body.classList.add('loaded');
    document.getElementById('main-content').style.display = 'block';
  }

  // Cycle dots after "LOADING"
  const loadingText = document.getElementById('loading-text');
  let dotCount = 0;

  setInterval(() => {
    dotCount = (dotCount + 1) % 4; // Cycle between 0, 1, 2, 3
    loadingText.textContent = 'LOADING' + '.'.repeat(dotCount);
  }, 300); // Update every 300ms
});

