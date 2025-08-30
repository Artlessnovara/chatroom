window.addEventListener('DOMContentLoaded', () => {
    // --- Element References ---
    const screens = {
        splash: document.getElementById('splash-screen'),
        welcome: document.getElementById('welcome-screen'),
        login: document.getElementById('login-form-screen'),
        signupOptions: document.getElementById('signup-options-screen'),
        signupForm: document.getElementById('signup-email-form-screen'),
        profileSetup: document.getElementById('profile-setup-screen'),
        personalization: document.getElementById('personalization-screen'),
        onboarding: document.getElementById('onboarding-screen'),
        homeFeed: document.getElementById('home-feed-screen'),
    };

    const buttons = {
        login: document.getElementById('login-btn'),
        signup: document.getElementById('signup-btn'),
        backToWelcome: document.getElementById('back-to-welcome-btn'),
        signupEmail: document.getElementById('signup-email-btn'),
        backToOptions: document.getElementById('back-to-options-btn'),
        backFromLogin: document.getElementById('back-to-welcome-from-login-btn'),
        continueProfile: document.getElementById('continue-profile-setup-btn'),
        skipProfile: document.getElementById('skip-profile-setup-btn'),
        syncContacts: document.getElementById('sync-contacts-btn'),
        skipPersonalization: document.getElementById('skip-personalization-btn'),
        getStarted: document.getElementById('get-started-btn'),
    };

    const forms = {
        signup: document.getElementById('signup-form'),
        login: document.getElementById('login-form'),
    };

    const errorDivs = {
        signup: document.getElementById('form-error'),
        login: document.getElementById('login-error'),
    };

    const interestTags = document.querySelectorAll('.interest-tag');

    // --- Screen Navigation Logic ---
    const allScreens = Object.values(screens);
    const showScreen = (screenToShow) => {
        allScreens.forEach(screen => {
            if (screen) screen.classList.add('hidden');
        });
        if (screenToShow) screenToShow.classList.remove('hidden');
    };

    // --- Initial Splash Screen ---
    setTimeout(() => showScreen(screens.welcome), 3500);

    // --- Event Listeners ---
    buttons.signup?.addEventListener('click', () => showScreen(screens.signupOptions));
    buttons.login?.addEventListener('click', () => showScreen(screens.login));
    buttons.backToWelcome?.addEventListener('click', () => showScreen(screens.welcome));
    buttons.backFromLogin?.addEventListener('click', () => showScreen(screens.welcome));
    buttons.signupEmail?.addEventListener('click', () => showScreen(screens.signupForm));
    buttons.backToOptions?.addEventListener('click', () => showScreen(screens.signupOptions));

    // Onboarding Flow
    buttons.continueProfile?.addEventListener('click', () => showScreen(screens.personalization));
    buttons.skipProfile?.addEventListener('click', () => showScreen(screens.personalization));
    buttons.syncContacts?.addEventListener('click', () => showScreen(screens.onboarding));
    buttons.skipPersonalization?.addEventListener('click', () => showScreen(screens.onboarding));
    buttons.getStarted?.addEventListener('click', () => showScreen(screens.homeFeed));

    // Interest Tag selection
    interestTags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('active');
        });
    });

    // --- Form Submission ---
    forms.signup?.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorDivs.signup.classList.add('hidden');

        const fullName = forms.signup.querySelector('#fullname').value;
        const username = forms.signup.querySelector('#username').value;
        const password = forms.signup.querySelector('#password').value;

        if (!fullName || !username || !password) {
            errorDivs.signup.textContent = 'All fields are required.';
            errorDivs.signup.classList.remove('hidden');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5001/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, username, password }),
            });
            const result = await response.json();
            if (!response.ok) {
                errorDivs.signup.textContent = result.error || 'An unknown error occurred.';
                errorDivs.signup.classList.remove('hidden');
            } else {
                // Successful registration, start the onboarding flow
                showScreen(screens.profileSetup);
            }
        } catch (error) {
            errorDivs.signup.textContent = 'Could not connect to the server.';
            errorDivs.signup.classList.remove('hidden');
        }
    });

    forms.login?.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorDivs.login.classList.add('hidden');

        const username = forms.login.querySelector('#login-username').value;
        const password = forms.login.querySelector('#login-password').value;

        if (!username || !password) {
            errorDivs.login.textContent = 'Username and password are required.';
            errorDivs.login.classList.remove('hidden');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const result = await response.json();
            if (!response.ok) {
                errorDivs.login.textContent = result.error || 'An unknown error occurred.';
                errorDivs.login.classList.remove('hidden');
            } else {
                // On successful login, go directly to home feed
                showScreen(screens.homeFeed);
            }
        } catch (error) {
            errorDivs.login.textContent = 'Could not connect to the server.';
            errorDivs.login.classList.remove('hidden');
        }
    });
});
