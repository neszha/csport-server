module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'airbnb-base',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'max-len': 'off',
        'no-console': 'off',
        'linebreak-style': 0,
        'no-param-reassign': 0,
        'no-underscore-dangle': 'off',
        indent: ['error', 4],
        'import/extensions': [
            'error', 'always',
            {
                js: 'always',
            },
        ],
    },
};
