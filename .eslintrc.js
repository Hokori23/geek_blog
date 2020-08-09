module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    parserOptions: {
        parser: "babel-eslint",
    },
    extends: ["@nuxtjs", "plugin:nuxt/recommended"],
    plugins: [],
    // add your custom rules here
    rules: {
        "vue/singleline-html-element-content-newline": 0,
        "vue/html-self-closing": 0,
        semi: [0, "always"],
        quotes: [
            0,
            "single",
            {
                // 允许字符串使用单引号或者双引号，只要字符串中包含了一个其他引号，否则需要转义
                avoidEscape: false,
                // 允许字符串使用反勾号
                allowTemplateLiterals: true,
            },
        ],
        "comma-dangle": [0, "always"],
        "space-before-function-paren": [0, "never"],
        "no-console": [1, { allow: ["warn", "error"] }],
    },
};
