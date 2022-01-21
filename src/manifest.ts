import fs from 'fs-extra';
import type { Manifest } from 'webextension-polyfill';
import type PkgType from '../package.json';
import { isDev, port, r } from '../scripts/utils';

export async function getManifest(): Promise<Manifest.WebExtensionManifest> {
    const pkg = (await fs.readJSON(r('package.json'))) as typeof PkgType;

    // update this file to update this manifest.json
    // can also be conditional based on your need
    const manifest: Manifest.WebExtensionManifest = {
        manifest_version: 2,
        name: pkg.displayName || pkg.name,
        version: pkg.version,
        default_locale: 'en',
        description: '__MSG_appDesc__',
        content_security_policy: `script-src 'self' 'wasm-eval'; object-src 'self'`,
        browser_action: {
            default_icon: './assets/icon-512.png',
            default_popup: './dist/popup/index.html'
        },
        background: {
            page: './dist/background/index.html',
            persistent: false
        },
        icons: {
            16: './assets/icon-512.png',
            48: './assets/icon-512.png',
            128: './assets/icon-512.png'
        },
        permissions: ['tabs', 'storage', 'activeTab', 'http://*/', 'https://*/'],
        content_scripts: [
            {
                matches: ['http://*/*', 'https://*/*'],
                js: ['./dist/content/index.global.js']
            }
        ],
        web_accessible_resources: []
    };

    if (isDev) {
        // for content script, as browsers will cache them for each reload,
        // we use a background script to always inject the latest version
        // see src/background/contentScriptHMR.ts
        delete manifest.content_scripts;
        manifest.permissions?.push('webNavigation');

        // this is required on dev for Vite script to load
        manifest.content_security_policy = `script-src 'self' 'wasm-eval' http://localhost:${port}; object-src 'self'`;
    }

    return manifest;
}
