module.exports = {
    extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ["@typescript-eslint"],
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.ts'],
      },
      "import/resolver": "webpack",
    },
    rules: {
      "semi": "off",
      "no-console": "off",
      "import/no-extraneous-dependencies": [2, { devDependencies: [, '**/test.ts'] }],
      "import/prefer-default-export": 0,
      '@typescript-eslint/indent': [2, 2],
      "@typescript-eslint/semi": ["error"],
      "@typescript-eslint/interface-name-prefix": 0,
    },
  };