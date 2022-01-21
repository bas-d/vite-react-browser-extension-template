declare module '*.svg' {
    const content: string;
    export default content;
}

declare const __APP_VERSION__: 'chrome' | 'firefox' | 'edge';
declare const __BROWSER__: string;
