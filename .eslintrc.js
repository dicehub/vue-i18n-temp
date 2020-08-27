module.exports = {
  root: true,

  env: {
    browser: true,
  },

  extends: ['plugin:vue/recommended', 'eslint:recommended', 'airbnb-base', '@vue/prettier'],

  plugins: ['json-format'],

  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2020,
  },

  overrides: [
    {
      files: ['__tests__/**/*.js', '**/tests/**/*.spec.js'],
      env: {
        jest: true,
      },
      globals: {
        fetchMock: 'readonly',
      },
    },
  ],

  settings: {
    'json/sort-package-json': 'standard',
    'json/ignore-files': ['**/package-lock.json'],
    'json/json-with-comments-files': ['.vscode/**'],
  },

  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'max-len': ['error', 100],
    'no-plusplus': 'off',
    'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
    'generator-star-spacing': ['error', { before: true, after: false }],
    'no-param-reassign': 'off',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'no-restricted-syntax': ['off', "BinaryExpression[operator='in']"],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'if' },
      { blankLine: 'always', prev: 'if', next: '*' },
      { blankLine: 'always', prev: 'function', next: '*' },
      { blankLine: 'always', prev: '*', next: 'function' },
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: 'for', next: '*' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
    ],
    'comma-dangle': [
      'error',
      {
        functions: 'ignore',
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
      },
    ],
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
  },
};
