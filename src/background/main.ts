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
        console.log('Hello world!');
    } catch (error) {
        logger.error(error);
    }
})();
