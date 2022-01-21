import logger from '../shared/Logger';

// only on dev mode
if (import.meta.hot) {
    // @ts-expect-error for background HMR
    import('/@vite/client');
    // load latest content script
    import('./contentScriptHMR');
}

(async function () {
    try {
        console.log(`We're running version ${__APP_VERSION__} on ${__BROWSER__}`);
    } catch (error) {
        logger.error(error);
    }
})();
