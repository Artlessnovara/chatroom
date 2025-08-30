window.addEventListener('DOMContentLoaded', () => {
    // Screen elements
    const splashScreen = document.getElementById('splash-screen');
    const welcomeScreen = document.getElementById('welcome-screen');
    const signupOptionsScreen = document.getElementById('signup-options-screen');
    const signupEmailFormScreen = document.getElementById('signup-email-form-screen');
    const loginFormScreen = document.getElementById('login-form-screen');

    // Buttons
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const backToWelcomeBtn = document.getElementById('back-to-welcome-btn');
    const signupEmailBtn = document.getElementById('signup-email-btn');
    const backToOptionsBtn = document.getElementById('back-to-options-btn');
    const backToWelcomeFromLoginBtn = document.getElementById('back-to-welcome-from-login-btn');

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

    // Welcome -> Login Form
    if (loginBtn && welcomeScreen && loginFormScreen) {
        loginBtn.addEventListener('click', () => {
            welcomeScreen.classList.add('hidden');
            loginFormScreen.classList.remove('hidden');
        });
    }

    // Login Form -> Welcome
    if (backToWelcomeFromLoginBtn && loginFormScreen && welcomeScreen) {
        backToWelcomeFromLoginBtn.addEventListener('click', () => {
            loginFormScreen.classList.add('hidden');
            welcomeScreen.classList.remove('hidden');
        });
    }

    // --- Form Submission Logic ---
    const signupForm = document.getElementById('signup-form');
    const formError = document.getElementById('form-error');

    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            formError.classList.add('hidden'); // Hide error on new submission

            const fullName = document.getElementById('fullname').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            if (!fullName || !username || !password) {
                formError.textContent = 'All fields are required.';
                formError.classList.remove('hidden');
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:5001/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ fullName, username, password }),
                });

                const result = await response.json();

                if (!response.ok) {
                    formError.textContent = result.error || 'An unknown error occurred.';
                    formError.classList.remove('hidden');
                } else {
                    alert('Registration successful! You can now log in.');
                    // In a real app, you would redirect to the login page or home feed.
                    window.location.reload(); // Simple way to reset to the start
                }
            } catch (error) {
                formError.textContent = 'Could not connect to the server. Please try again later.';
                formError.classList.remove('hidden');
            }
        });
    }

    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            loginError.classList.add('hidden');

            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            if (!username || !password) {
                loginError.textContent = 'Username and password are required.';
                loginError.classList.remove('hidden');
                return;
            }

            try {
                const response = await fetch('http://127.0.0.1:5001/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();

                if (!response.ok) {
                    loginError.textContent = result.error || 'An unknown error occurred.';
                    loginError.classList.remove('hidden');
                } else {
                    alert(result.message || 'Login successful!');
                    // In a real app, you would navigate to the home feed.
                    window.location.reload();
                }
            } catch (error) {
                loginError.textContent = 'Could not connect to the server. Please try again later.';
                loginError.classList.remove('hidden');
            }
        });
    }
});
