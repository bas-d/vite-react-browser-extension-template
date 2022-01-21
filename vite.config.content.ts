import { defineConfig } from 'vite';
import { sharedConfig } from './vite.config';
import { r, isDev } from './scripts/utils';
import packageJson from './package.json';

// bundling the content script using Vite
export default defineConfig({
    ...sharedConfig,
    build: {
        watch: isDev
            ? {
                  include: [r('src/content/**/*')]
              }
            : undefined,
        outDir: r('build/dist/content'),
        cssCodeSplit: false,
        emptyOutDir: false,
        sourcemap: isDev ? 'inline' : false,
        lib: {
            entry: r('src/content/index.tsx'),
            name: packageJson.name,
            formats: ['iife']
        },
        rollupOptions: {
            output: {
                entryFileNames: 'index.global.js',
                extend: true
            }
        }
    },
    plugins: [...sharedConfig.plugins!]
});
