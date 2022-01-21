module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react'],
    rules: {
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'react/react-in-jsx-scope': 'off'
    },
    settings: {
        react: {
            version: 'detect' // Tells eslint-plugin-react to automatically detect the version of React to use
        }
    },
    env: {
        es6: true,
        es2020: true,
        browser: true,
        webextensions: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
    ]
};
