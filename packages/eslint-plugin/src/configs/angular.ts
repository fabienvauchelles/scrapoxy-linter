export default {
    plugins: [
        '@angular-eslint/eslint-plugin',
        '@angular-eslint/eslint-plugin-template',
        '@typescript-eslint/eslint-plugin',
    ],
    extends: [
        'plugin:@angular-eslint/ng-cli-compat',
        'plugin:@angular-eslint/ng-cli-compat--formatting-add-on',
        'plugin:@angular-eslint/template/process-inline-templates',
    ],
    rules: {
        '@angular-eslint/component-selector': 'off',
        '@angular-eslint/directive-selector': 'off',
        'prefer-arrow/prefer-arrow-functions': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'max-len': [
            'error',
            {
                code: 360,
            },
        ],
        'space-before-function-paren': 'off',
        '@typescript-eslint/space-before-function-paren': [
            'error',
            'never'
        ],
    },
};
