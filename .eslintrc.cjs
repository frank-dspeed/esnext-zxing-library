// ESLint only works with .cjs inside of ESM Projects.
module.exports = {
    env: {
        es6: true,
        node: true
    },
    extends: ['eslint:recommended'],
    
    rules: {
        'no-console': 'error',
        curly: ['error', 'all'],
        'prefer-arrow-callback': 'error',
        'one-var': ['error', 'never'],
        'no-var': 'error',
        'prefer-const': 'error'
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    }
};
