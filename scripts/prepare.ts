// generate stub index.html files for dev entry
import { execSync } from 'child_process';
import fs from 'fs-extra';
import chokidar from 'chokidar';
import path from 'path';
import { r, port, isDev, log } from './utils';

/**
 * Stub index.html to use Vite in development
 */
async function stubIndexHtml() {
    const views = ['background', 'page'];

    for (const view of views) {
        await fs.ensureDir(r(`build/dist/${view}`));
        let data = await fs.readFile(r(`src/${view}/index.html`), 'utf-8');
        data = data
            .replace('"./main.ts"', `"http://localhost:${port}/${view}/main.ts"`)
            .replace('"./main.tsx"', `"http://localhost:${port}/${view}/main.tsx"`)
            .replace('<div id="app"></div>', '<div id="app">Vite server did not start</div>');
        await fs.writeFile(r(`build/dist/${view}/index.html`), data, 'utf-8');
        log('PRE', `stub ${view}`);
    }
}

function writeManifest() {
    execSync('npx esno ./scripts/manifest.ts', { stdio: 'inherit' });
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

writeManifest();

if (isDev) {
    stubIndexHtml();
    chokidar.watch(r('src/**/*.html')).on('change', () => {
        stubIndexHtml();
    });
    chokidar.watch([r('src/manifest.ts'), r('package.json')]).on('change', () => {
        writeManifest();
    });
}
