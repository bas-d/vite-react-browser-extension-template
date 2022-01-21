// generate stub index.html files for dev entry
import chokidar from 'chokidar';
import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import { getManifest } from '~/manifest';
import { isDev, log, port, r } from './utils';

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
        await fs.ensureDir(r(`build/dist/${view}`));
        let data = await fs.readFile(r(`src/${view}/index.html`), 'utf-8');
        data = data
            .replace('"./main.ts"', `"http://localhost:${port}/${view}/main.ts"`)
            .replace('"./main.tsx"', `"http://localhost:${port}/${view}/main.tsx"`)
            .replace('</head>', `  <script type="module">${preamble}</script>\n  </head>`)
            .replace('<div id="app"></div>', '<div id="app">Vite server did not start</div>');
        await fs.writeFile(r(`build/dist/${view}/index.html`), data, 'utf-8');
        log('PRE', `stub ${view}`);
    }
}

export async function writeManifest(hash: string): Promise<void> {
    await fs.writeJSON(r('build/manifest.json'), await getManifest(hash), { spaces: 2 });
    log('PRE', 'write manifest.json');
}

async function transformLocale() {
    const locales = await fs.readdir('src/locales/');
    for (const locale of locales) {
        const file = path.join('src', 'locales', locale, 'messages.json');
        const translations = await fs.readJSON(file);
        const updated = Object.fromEntries(
            Object.entries(translations).map(([key, value]) => [key, { message: value }])
        );
        await fs.ensureDir(r(`build/_locales/${locale}`));
        await fs.writeJSON(r(`build/_locales/${locale}/messages.json`), updated);
        log('PRE', `transform locale ${locale}`);
    }
}

transformLocale();

writeManifest(hash);

if (isDev) {
    stubIndexHtml();
    chokidar.watch(r('src/**/*.html')).on('change', () => {
        stubIndexHtml();
    });
    chokidar.watch([r('src/manifest.ts'), r('package.json')]).on('change', () => {
        writeManifest(hash);
    });
}
