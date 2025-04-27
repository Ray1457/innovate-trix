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

function startGlitchEffect() {
    const glitchElements = document.querySelectorAll('.glitch-text');

    glitchElements.forEach(el => {
        const originalText = el.innerText;
        const characters = originalText.split('');

        setInterval(() => {
            let glitchedText = [...characters];

            // Pick random indexes to glitch, spaced apart
            let lastIndex = -30;
            for (let i = 0; i < glitchedText.length; i++) {
                if (Math.random() < 0.02 && i - lastIndex > 30 && glitchedText[i] !== ' ') {
                    lastIndex = i;
                    // Replace with a random character (A-Z, a-z, 0-9)
                    const randomChar = String.fromCharCode(
                        Math.floor(Math.random() * (126 - 33)) + 33
                    );
                    glitchedText[i] = randomChar;
                }
            }

            el.innerText = glitchedText.join('');
        }, 200); // flicker speed (in ms)
    });
}

// Run glitch after page loads
document.addEventListener('DOMContentLoaded', startGlitchEffect);


