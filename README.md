# WebExtension Vite Starter

A [Vite](https://vitejs.dev/) powered WebExtension ([Chrome](https://developer.chrome.com/docs/extensions/reference/), [FireFox](https://addons.mozilla.org/en-US/developers/), etc.) starter template.

## Features

-   ⚡️ **Instant HMR** - use **Vite** on dev (no more refresh!)
-   🥝 React 17
-   🦾 [TypeScript](https://www.typescriptlang.org/) - type safe
-   🖥 Content Script - Use React even in content script
-   🌍 WebExtension - isomorphic extension for Chrome, Firefox, and others
-   📃 Dynamic `manifest.json` with full type support

## Pre-packed

### WebExtension Libraries

-   [`webextension-polyfill`](https://github.com/mozilla/webextension-polyfill) - WebExtension browser API Polyfill with types

### Vite Plugins

-   [`@vitejs/plugin-react`](https://github.com/vitejs/vite/tree/main/packages/plugin-react) - React plugin for Vite.

### Coding Style

-   [ESLint](https://eslint.org/)
-   [Prettier](http://prettier.io/)

### Dev tools

-   [TypeScript](https://www.typescriptlang.org/)
-   [esno](https://github.com/antfu/esno) - TypeScript / ESNext node runtime powered by esbuild
-   [npm-run-all](https://github.com/mysticatea/npm-run-all) - Run multiple npm-scripts in parallel or sequential
-   [web-ext](https://github.com/mozilla/web-ext) - Streamlined experience for developing web extensions

## Use the Template

### GitHub Template

[Create a repo from this template on GitHub](https://github.com/bas-d/vite-react-browser-extension-template/generate).

### Clone to local

If you prefer to do it manually with the cleaner git history

```bash
npx degit bas-d/vite-react-browser-extension-template my-webext
cd my-webext
npm i
```

## Usage

### Folders

-   `src` - main source.
    -   `content` - scripts and components to be injected as `content_script`
    -   `background` - scripts for background.
    -   `page` - example page in your extension
    -   `components` - React components.
    -   `manifest.ts` - manifest for the extension.
-   `build` - extension package root.
    -   `assets` - static assets.
    -   `dist` - built files, also serve stub entry for Vite on development.
-   `scripts` - development and bundling helper scripts.

### Development

```bash
npm dev
```

Then **load extension in browser with the `build/` folder**.

For Firefox developers, you can run the following command instead:

```bash
npm start:firefox
```

`web-ext` auto reload the extension when `extension/` files changed.

> While Vite handles HMR automatically in the most of the case, [Extensions Reloader](https://chrome.google.com/webstore/detail/fimgfedafeadlieiabdeeaodndnlbhid) is still recommanded for cleaner hard reloading.

### Build

To build the extension, run

```bash
npm build
```

And then pack files under `build`, you can upload `extension.crx` or `extension.xpi` to appropriate extension store.

## Credits

This template is originally made by [Anthony Fu](https://github.com/antfu) and adopted to work with React.
