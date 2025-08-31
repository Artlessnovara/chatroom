window.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    let currentUserId = null;

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
        themePreview: document.getElementById('theme-preview-screen'),
        homeFeed: document.getElementById('home-feed-screen'),
    };

    const buttons = {
        login: document.getElementById('login-btn'),
        signup: document.getElementById('signup-btn'),
        backToWelcome: document.getElementById('back-to-welcome-btn'),
        signupEmail: document.getElementById('signup-email-btn'),
        backToOptions: document.getElementById('back-to-options-btn'),
        backFromLogin: document.getElementById('back-to-welcome-from-login-btn'),
        skipProfile: document.getElementById('skip-profile-setup-btn'),
        syncContacts: document.getElementById('sync-contacts-btn'),
        skipPersonalization: document.getElementById('skip-personalization-btn'),
        getStarted: document.getElementById('get-started-btn'),
        continueToHome: document.getElementById('continue-to-home-btn'),
    };

    const forms = {
        signup: document.getElementById('signup-form'),
        login: document.getElementById('login-form'),
        profileSetup: document.getElementById('profile-setup-form'),
    };

    const errorDivs = {
        signup: document.getElementById('form-error'),
        login: document.getElementById('login-error'),
        profile: document.getElementById('profile-error'),
    };

    const themeChoices = document.querySelectorAll('.theme-choice');

    // --- Screen Navigation Logic ---
    const allScreens = Object.values(screens);
    const showScreen = (screenToShow) => {
        allScreens.forEach(screen => screen?.classList.add('hidden'));
        screenToShow?.classList.remove('hidden');
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

    // Onboarding Flow Navigation
    buttons.skipProfile?.addEventListener('click', () => showScreen(screens.personalization));
    buttons.syncContacts?.addEventListener('click', () => showScreen(screens.onboarding));
    buttons.skipPersonalization?.addEventListener('click', () => showScreen(screens.onboarding));
    buttons.getStarted?.addEventListener('click', () => showScreen(screens.themePreview)); // Go to Theme Preview
    buttons.continueToHome?.addEventListener('click', () => showScreen(screens.homeFeed)); // Go to Home

    // Interest Tag selection
    document.querySelectorAll('.interest-tag').forEach(tag => {
        tag.addEventListener('click', () => tag.classList.toggle('active'));
    });

    // Password Toggle
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', () => {
            const passwordInput = button.previousElementSibling;
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                button.textContent = '🙈';
            } else {
                passwordInput.type = 'password';
                button.textContent = '👁';
            }
        });
    });

    // Theme Selection
    themeChoices.forEach(choice => {
        choice.addEventListener('click', () => {
            themeChoices.forEach(c => c.classList.remove('active'));
            choice.classList.add('active');
            if (choice.dataset.theme === 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        });
    });

    // --- Form Submission Logic ---
    forms.signup?.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorDivs.signup.classList.add('hidden');
        const { fullname, email, username, password } = Object.fromEntries(new FormData(event.target));

        if (!fullname || !email || !username || !password) {
            errorDivs.signup.textContent = 'All fields are required.';
            errorDivs.signup.classList.remove('hidden');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5001/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName: fullname, email, username, password }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'An unknown error occurred.');
            }
            currentUserId = result.userId;
            showScreen(screens.profileSetup);
        } catch (error) {
            errorDivs.signup.textContent = error.message;
            errorDivs.signup.classList.remove('hidden');
        }
    });

    forms.profileSetup?.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorDivs.profile.classList.add('hidden');
        const formData = new FormData(forms.profileSetup);
        formData.append('userId', currentUserId);

        const activeInterests = forms.profileSetup.querySelectorAll('.interest-tag.active');
        activeInterests.forEach(tag => {
            formData.append('interests[]', tag.textContent);
        });

        try {
            const response = await fetch('http://127.0.0.1:5001/api/profile/setup', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'An unknown error occurred.');
            }
            showScreen(screens.personalization);
        } catch (error) {
            errorDivs.profile.textContent = error.message;
            errorDivs.profile.classList.remove('hidden');
        }
    });

    forms.login?.addEventListener('submit', async (event) => {
        event.preventDefault();
        errorDivs.login.classList.add('hidden');
        const { email, password } = Object.fromEntries(new FormData(event.target));

        if (!email || !password) {
            errorDivs.login.textContent = 'Email and password are required.';
            errorDivs.login.classList.remove('hidden');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'An unknown error occurred.');
            }
            showScreen(screens.themePreview); // Go to Theme Preview on login
        } catch (error) {
            errorDivs.login.textContent = error.message;
            errorDivs.login.classList.remove('hidden');
        }
    });
});
