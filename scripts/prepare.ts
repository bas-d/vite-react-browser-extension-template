// generate stub index.html files for dev entry
import { execSync } from 'child_process';
import chokidar from 'chokidar';
import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import { isDev, log, port, r } from './utils';

const browser = process.env.BROWSER ?? 'chrome';

// This enable react-refresh
const preamble = `
      import RefreshRuntime from "http://localhost:${port}/@react-refresh";
      RefreshRuntime.injectIntoGlobalHook(window);
      window.$RefreshReg$ = () => {};
      window.$RefreshSig$ = () => (type) => type;
      window.__vite_plugin_react_preamble_installed__ = true;
    `;
const algorithm = 'sha256';
const hash = `${algorithm}-${crypto.createHash(algorithm).update(preamble).digest('base64')}`;
log('PRE', `integrity hash ${hash}`);

/**
 * Stub index.html to use Vite in development
 */
async function stubIndexHtml() {
    const views = ['background', 'page', 'popup'];

    for (const view of views) {
        await fs.ensureDir(r(`build/${browser}/${view}`));
        let data = await fs.readFile(r(`src/${view}/index.html`), 'utf-8');
        data = data
            .replace('"./main.ts"', `"http://localhost:${port}/${view}/main.ts"`)
            .replace('"./main.tsx"', `"http://localhost:${port}/${view}/main.tsx"`)
            .replace('</head>', `  <script type="module">${preamble}</script>\n  </head>`)
            .replace('<div id="app"></div>', '<div id="app">Vite server did not start</div>');
        await fs.writeFile(r(`build/${browser}/${view}/index.html`), data, 'utf-8');
        log('PRE', `stub ${view}`);
    }
}

function writeManifest(hash: string) {
    execSync(`npx esno ./scripts/manifest.ts ${browser} ${hash}`, { stdio: 'inherit' });
}

async function transformLocale() {
    const locales = await fs.readdir('src/locales/');
    for (const locale of locales) {
        const file = path.join('src', 'locales', locale, 'messages.json');
        const translations = await fs.readJSON(file);
        const updated = Object.fromEntries(
            Object.entries(translations).map(([key, value]) => [key, { message: value }])
        );
        await fs.ensureDir(r(`build/${browser}/_locales/${locale}`));
        await fs.writeJSON(r(`build/${browser}/_locales/${locale}/messages.json`), updated);
        log('PRE', `transform locale ${locale}`);
    }
}

async function copyAssets() {
    await fs.ensureDir(r(`build/${browser}/assets`));
    await fs.copy(r('public/assets'), r(`build/${browser}/assets`));
}

transformLocale();

writeManifest(hash);

copyAssets();

if (isDev) {
    stubIndexHtml();
    chokidar.watch(r('src/**/*.html')).on('change', () => {
        stubIndexHtml();
    });
    chokidar.watch([r('src/manifest.ts'), r('package.json')]).on('change', () => {
        writeManifest(hash);
    });
    chokidar.watch(r('public/assets')).on('change', () => {
        copyAssets();
    });
}
