document.addEventListener('DOMContentLoaded', () => {

    navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
            // Success
            console.info('PAGE: Service worker registered.')
        }, (errorInfo) => {
            // Error
            console.info(`PAGE: Service worker registration failed`);
            console.info(errorInfo);
        });

});