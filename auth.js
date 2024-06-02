document.addEventListener('DOMContentLoaded', function() {
    if (window.netlifyIdentity) {
        window.netlifyIdentity.on('init', user => {
            handleUserState(user);
        });

        window.netlifyIdentity.on('login', user => {
            handleUserState(user);
        });

        window.netlifyIdentity.on('logout', () => {
            handleUserState(null);
        });

        window.netlifyIdentity.on('error', err => {
            console.error('Netlify Identity error', err);
        });

        window.netlifyIdentity.init();
    }

    function handleUserState(user) {
        if (user) {
            showAppContent();
        } else {
            hideAppContent();
            window.netlifyIdentity.open();
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
