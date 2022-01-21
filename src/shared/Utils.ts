import browser, { Tabs } from 'webextension-polyfill';

const t = browser.i18n.getMessage;

async function currentTab(): Promise<{ id: number; url: string }> {
    const query = {
        active: true,
        currentWindow: true
    };

    const tabs = await browser.tabs.query(query);
    const tab = tabs[0];
    if (tab != null && tab.id != null && tab.url != null) {
        return { id: tab.id, url: tab.url };
    } else {
        throw new Error('Could not get current tab');
    }
}

/**
 * Creates a new tab or switches if it already exists.
 */
async function loadTab(url: string, reload: boolean, active: boolean): Promise<number | undefined> {
    const [tab] = await browser.tabs.query({
        url: !url.endsWith('/') ? `${url}/` : url
    });
    if (tab != null) {
        if (reload) {
            await browser.tabs.reload(tab.id);
            return tab.id;
        }
        await browser.tabs.update(tab.id, { active });
        return tab.id;
    } else {
        const tab = await browser.tabs.create({ url, active });
        return tab.id;
    }
}

async function loadTabAndWait(url: string, active: boolean): Promise<number | undefined> {
    const loadedTabId = await loadTab(url, true, active);
    return new Promise((resolve) => {
        let timer: NodeJS.Timeout | undefined = undefined;

        async function listener(
            this: unknown,
            tabId: number,
            changeInfo: Tabs.OnUpdatedChangeInfoType,
            tab: Tabs.Tab
        ): Promise<void> {
            if (tabId === loadedTabId && changeInfo.status === 'complete') {
                if (timer != null) {
                    clearTimeout(timer);
                }
                if (browser.tabs.onUpdated.removeListener != null) {
                    browser.tabs.onUpdated.removeListener(listener);
                }
                resolve(tab.id);
            }
        }

        browser.tabs.onUpdated.addListener(listener);

        timer = setTimeout(() => {
            if (browser.tabs.onUpdated.removeListener != null) {
                browser.tabs.onUpdated.removeListener(listener);
            }
            resolve(undefined);
        }, 10000);
    });
}

export { t, loadTab, loadTabAndWait, currentTab };
