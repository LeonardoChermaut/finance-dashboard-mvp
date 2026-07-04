import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default [
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      'prettier/prettier': 'error',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',

      '@typescript-eslint/no-inferrable-types': 'off',

      'prefer-const': 'error',
      'no-var': 'error',

      'id-length': ['error', { min: 2, exceptions: [] }],

      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message: 'Default exports are not allowed. Use named exports only.',
        },
      ],

      'func-style': ['error', 'expression', { allowArrowFunctions: true }],
      'prefer-arrow-callback': 'error',

      curly: ['error', 'all'],
      'brace-style': ['error', '1tbs', { allowSingleLine: false }],

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message: 'Use the @ alias instead of relative cross-domain imports.',
            },
          ],
        },
      ],

      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'warn',
    },
  },
  {
    files: ['src/app/**/page.tsx', 'src/app/**/layout.tsx'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['tests/**/*.ts', 'src/**/*.test.ts', 'src/**/*.test.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      'prettier/prettier': 'error',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',

      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',

      'prefer-const': 'error',
      'no-var': 'error',

      'id-length': ['error', { min: 2, exceptions: [] }],

      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportDefaultDeclaration',
          message: 'Default exports are not allowed. Use named exports only.',
        },
      ],

      'func-style': ['error', 'expression', { allowArrowFunctions: true }],
      'prefer-arrow-callback': 'error',

      curly: ['error', 'all'],
      'brace-style': ['error', '1tbs', { allowSingleLine: false }],

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*'],
              message: 'Use the @ alias instead of relative cross-domain imports.',
            },
          ],
        },
      ],

      'no-console': 'off',
    },
  },
  prettierConfig,
];
