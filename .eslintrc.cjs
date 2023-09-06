/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'prettier'
  ],
  plugins: ['prettier'],
  overrides: [
    {
      files: [
        'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'
      ],
      'extends': [
        'plugin:cypress/recommended'
      ]
    }
  ],
  rules: {
    "vue/component-name-in-template-casing": ["error", "PascalCase", {
      "registeredComponentsOnly": true,
      "ignores": []
    }]
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
