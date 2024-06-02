document.addEventListener('DOMContentLoaded', function() {
    if (window.netlifyIdentity) {
        // Adiciona um evento para verificar se o usuário está logado
        window.netlifyIdentity.on('init', user => {
            if (user) {
                showAppContent();
            } else {
                window.netlifyIdentity.open();
            }
        });

        // Evento ao fazer login
        window.netlifyIdentity.on('login', user => {
            showAppContent();
        });

        // Evento ao fazer logout
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
