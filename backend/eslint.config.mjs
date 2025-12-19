import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { ignores: ['dist/**', 'build/**', 'node_modules/**', 'coverage/**'] },
  { languageOptions: { globals: { ...globals.node, ...globals.es2021 } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  {
    rules: {
      // Console warnings instead of errors (ok for development, not for production)
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports'},
      ],

      // Code quality
      "no-debugger": "warn",
      "no-alert": "error",
      "prefer-const": "warn",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      "no-throw-literal": "error",
      "no-duplicate-imports": "error",
    },
  },
];
