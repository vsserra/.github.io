document.addEventListener('DOMContentLoaded', () => {
    function isMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        
        // Detecta se é um iPad (iPads mais novos são identificados como Mac)
        const isIpad = /iPad|Macintosh/i.test(userAgent) && navigator.maxTouchPoints && navigator.maxTouchPoints > 1;

        // Detecta outros dispositivos móveis (exceto iPads)
        const isMobileDevice = /android|iphone|ipod|blackberry|windows phone|opera mini|mobile/i.test(userAgent.toLowerCase());

        // Se for mobile e não for iPad, redireciona para aviso.html
        if (isMobileDevice && !isIpad) {
            window.location.href = "aviso.html";
        }
    }

    isMobile();
});
