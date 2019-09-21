module.exports = {
    extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: ["@typescript-eslint"],
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.ts'],
      },
      "import/resolver": "webpack"
      // "import/resolver": {
      //   node: {
      //     "paths": ["src"]
      //   }
      // },
      // 'import/resolver': {
      //   typescript: {
      //     paths: ["src"]
      //   }
      // },
    },
    rules: {
      "semi": "off",
      "no-console": "off",
      'import/no-extraneous-dependencies': [2, { devDependencies: [, '**/test.ts'] }],
      '@typescript-eslint/indent': [2, 2],
      "@typescript-eslint/semi": ["error"]
    },
  };