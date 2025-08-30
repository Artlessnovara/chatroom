window.addEventListener('load', () => {
    const splashScreen = document.getElementById('splash-screen');
    const welcomeScreen = document.getElementById('welcome-screen');

    // The splash screen animation is set to 2.5s delay + 1s duration in CSS.
    // We'll remove the splash screen from the DOM and show the welcome screen slightly after.
    setTimeout(() => {
        if (splashScreen) {
            splashScreen.classList.add('hidden');
        }
        if (welcomeScreen) {
            welcomeScreen.classList.remove('hidden');
        }
    }, 3500); // Matches the total time of the CSS animation (2.5s delay + 1s duration)
});
