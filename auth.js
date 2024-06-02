document.addEventListener('DOMContentLoaded', function() {
    if (window.netlifyIdentity) {
        window.netlifyIdentity.on('init', user => {
            if (!user) {
                window.netlifyIdentity.open();
            } else {
                showAppContent();
            }
        });

        window.netlifyIdentity.on('login', user => {
            showAppContent();
        });

        window.netlifyIdentity.on('logout', () => {
            hideAppContent();
            window.netlifyIdentity.open();
        });

        const loginButton = document.getElementById('loginButton');
        if (loginButton) {
            loginButton.addEventListener('click', () => {
                window.netlifyIdentity.open();
            });
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
