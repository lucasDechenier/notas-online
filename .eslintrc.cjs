module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-strongly-recommended"
    ],
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
        "vue/html-closing-bracket-newline": "off",
        "vue/multi-word-component-names": "off",
        "vue/max-attributes-per-line": ["error", {
          "singleline": {
            "max": 2
          },      
          "multiline": {
            "max": 1
          }
        }]
    }
}
