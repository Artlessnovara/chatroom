window.addEventListener('DOMContentLoaded', () => {
    // Screen elements
    const splashScreen = document.getElementById('splash-screen');
    const welcomeScreen = document.getElementById('welcome-screen');
    const signupOptionsScreen = document.getElementById('signup-options-screen');
    const signupEmailFormScreen = document.getElementById('signup-email-form-screen');

    // Buttons
    const signupBtn = document.getElementById('signup-btn');
    const backToWelcomeBtn = document.getElementById('back-to-welcome-btn');
    const signupEmailBtn = document.getElementById('signup-email-btn');
    const backToOptionsBtn = document.getElementById('back-to-options-btn');

    // --- Initial Splash Screen Logic ---
    // The CSS animation for the splash screen has a 2.5s delay and a 1s duration.
    if (splashScreen && welcomeScreen) {
        setTimeout(() => {
            splashScreen.classList.add('hidden');
            welcomeScreen.classList.remove('hidden');
        }, 3500);
    }

    // --- Navigation Logic ---
    // Welcome -> Sign Up Options
    if (signupBtn && welcomeScreen && signupOptionsScreen) {
        signupBtn.addEventListener('click', () => {
            welcomeScreen.classList.add('hidden');
            signupOptionsScreen.classList.remove('hidden');
        });
    }

    // Sign Up Options -> Welcome
    if (backToWelcomeBtn && signupOptionsScreen && welcomeScreen) {
        backToWelcomeBtn.addEventListener('click', () => {
            signupOptionsScreen.classList.add('hidden');
            welcomeScreen.classList.remove('hidden');
        });
    }

    // Sign Up Options -> Email Form
    if (signupEmailBtn && signupOptionsScreen && signupEmailFormScreen) {
        signupEmailBtn.addEventListener('click', () => {
            signupOptionsScreen.classList.add('hidden');
            signupEmailFormScreen.classList.remove('hidden');
        });
    }

    // Email Form -> Sign Up Options
    if (backToOptionsBtn && signupEmailFormScreen && signupOptionsScreen) {
        backToOptionsBtn.addEventListener('click', () => {
            signupEmailFormScreen.classList.add('hidden');
            signupOptionsScreen.classList.remove('hidden');
        });
    }
});
