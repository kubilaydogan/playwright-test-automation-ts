
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import playwrightPlugin from 'eslint-plugin-playwright';

export default [
    js.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: 'module',
                project: './tsconfig.json',
            },
            globals: {
                process: 'readonly',
                Buffer: 'readonly',
                __dirname: 'readonly',
                __filename: 'readonly',
                global: 'readonly',
                console: 'readonly',
                window: 'readonly',
                document: 'readonly',
                screen: 'readonly',
                require: 'readonly',
                module: 'readonly',
                exports: 'readonly',
                error: 'readonly'
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-inferrable-types': 'error',
            'no-undef': 'off'
        },
    },
    {
        files: ['**/*.spec.ts', '**/*.test.ts', '**/tests/**/*.ts'],
        plugins: {
            playwright: playwrightPlugin,
        },
        rules: {
            ...playwrightPlugin.configs.recommended.rules,
            'playwright/expect-expect': 'warn',
            'playwright/no-wait-for-timeout': 'warn',
            'playwright/no-force-option': 'warn',
            'playwright/prefer-web-first-assertions': 'error',
        },
    },
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'build/**',
            '**/*.js',
            'playwright-report/**',
            'test-results/**',
            'allure-report/**',
            'allure-results/**',
        ],
    },
];
