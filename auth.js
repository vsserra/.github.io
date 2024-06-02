document.addEventListener('DOMContentLoaded', function() {
    if (window.netlifyIdentity) {
        window.netlifyIdentity.on('init', user => {
            console.log('Netlify Identity initialized', user);
            handleUserState(user);
        });

        window.netlifyIdentity.on('login', user => {
            console.log('User logged in', user);
            handleUserState(user);
        });

        window.netlifyIdentity.on('logout', () => {
            console.log('User logged out');
            handleUserState(null);
        });

        window.netlifyIdentity.on('error', err => {
            console.error('Netlify Identity error', err);
        });

        window.netlifyIdentity.init();

        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.addEventListener('click', () => {
                window.netlifyIdentity.open();
            });
        }
    }

    function handleUserState(user) {
        if (user) {
            showAppContent();
        } else {
            hideAppContent();
        }
    }

    function showAppContent() {
        document.getElementById('loginButton').classList.add('hidden');
        document.getElementById('appContent').classList.remove('hidden');
    }

    function hideAppContent() {
        document.getElementById('loginButton').classList.remove('hidden');
        document.getElementById('appContent').classList.add('hidden');
    }
});
