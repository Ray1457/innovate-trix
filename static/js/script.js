//nav scrolling 

window.addEventListener('scroll', function () {
    const hiddenNav = document.querySelector('.nav-hidden'); // Select the hidden nav
    if (window.scrollY > 500) {
        hiddenNav.classList.add('nav-visible'); // Add the visible class
    } else {
        hiddenNav.classList.remove('nav-visible'); // Remove the visible class
    }
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
                if (Math.random() < 0.02 && i - lastIndex > 40 && glitchedText[i] !== ' ') {
                    lastIndex = i;
                    // Replace with a random character (A-Z, a-z, 0-9)
                    const randomChar = String.fromCharCode(
                        Math.floor(Math.random() * (126 - 33)) + 33
                    );
                    glitchedText[i] = randomChar;
                }
            }

            el.innerText = glitchedText.join('');
        }, 300); // flicker speed (in ms)
    });
}

// Run glitch after page loads
document.addEventListener('DOMContentLoaded', startGlitchEffect);


