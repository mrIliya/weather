/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    extends: [
        "plugin:vue/vue3-strongly-recommended",
        "plugin:vue/strongly-recommended",
        "plugin:vue/vue3-recommended",
        "plugin:vue/recommended"
    ],
    env: {
        es6: true,
        browser: true,
        node: true,
    },
    rules: {
        'vue/no-unused-vars': 'warn',
        "vue/html-self-closing": ["error", {
            "html": {
                "void": "always",
                "normal": "always",
                "component": "always"
            },
            "svg": "always",
            "math": "always"
        }],

        "vue/singleline-html-element-content-newline": ["error", {
            "ignoreWhenNoAttributes": true,
            "ignoreWhenEmpty": true,
            "ignores": ["pre", "textarea"]
        }],
        'vue/singleline-html-element-content-newline': 'off',
        'vue/multiline-html-element-content-newline': 'off',
        'vue/multi-word-component-names': 0
    },
    ignorePatterns: ['*.test.js'],
}
