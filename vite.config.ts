import { dirname, relative } from 'path';
import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgrPlugin from 'vite-plugin-svgr';
import { r, port, isDev } from './scripts/utils';
import { version } from './package.json';

const browser = process.env.BROWSER ?? 'chrome';

export const sharedConfig: UserConfig = {
    root: r('src'),
    resolve: {
        alias: {
            '~/': `${r('src')}/`
        }
    },
    define: {
        __APP_VERSION__: JSON.stringify(version),
        __BROWSER__: JSON.stringify(browser)
    },
    plugins: [
        react(),
        svgrPlugin({
            svgrOptions: {
                icon: true
            }
        }),
        // rewrite assets to use relative path
        {
            name: 'assets-rewrite',
            enforce: 'post',
            apply: 'build',
            transformIndexHtml: (html: string, { path }): string =>
                html.replace(/"\/assets\//g, `"${relative(dirname(path), '/assets')}/`)
        }
    ],
    optimizeDeps: {
        include: ['webextension-polyfill']
    }
};

export default defineConfig(({ command }) => ({
    ...sharedConfig,
    base: command === 'serve' ? `http://localhost:${port}/` : '/dist/',
    server: {
        port,
        hmr: {
            host: 'localhost'
        }
    },
    build: {
        outDir: r(`build/${browser}`),
        emptyOutDir: false,
        sourcemap: isDev ? 'inline' : false,
        // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
        terserOptions: {
            mangle: false
        },
        rollupOptions: {
            input: {
                background: r('src/background/index.html'),
                page: r('src/page/index.html'),
                popup: r('src/popup/index.html')
            }
        }
    },
    plugins: [...sharedConfig.plugins!]
}));
