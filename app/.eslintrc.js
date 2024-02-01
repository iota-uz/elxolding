module.exports = {
    'root': true,
    'env': {
        'browser': true,
        'es2021': true,
        'node': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-essential',
        'plugin:vue/vue3-recommended'
    ],
    'overrides': [
        {
            'env': {
                'node': true
            },
            'files': [
                '.eslintrc.{js,cjs}'
            ],
            'parserOptions': {
                'sourceType': 'script'
            }
        }
    ],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'parser': '@typescript-eslint/parser',
        'sourceType': 'module'
    },
    'plugins': [
        '@typescript-eslint',
        'vue',
        'simple-import-sort',
        'unused-imports'
    ],
    'rules': {
        'unused-imports/no-unused-imports-ts': 2,
        'no-console': ['error', {'allow': ['warn', 'error', 'clear', 'assert']}],
        'indent': [
            'error',
            4,
            {'SwitchCase': 1}
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-undef': 'off',
        'no-prototype-builtins': 'off',
        'vue/multi-word-component-names': 0,
        'vue/camelcase': 'error',
        'vue/require-v-for-key': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        'vue/component-definition-name-casing': ['error', 'PascalCase'],
        'vue/component-api-style': ['error', ['script-setup']],
        'vue/block-order': ['error', {
            'order': [ [ 'script', 'template' ], 'style' ]
        }],
        'vue/order-in-components': ['error', {
            'order': [
                'el',
                'name',
                'key',
                'parent',
                'functional',
                ['delimiters', 'comments'],
                ['components', 'directives', 'filters'],
                'extends',
                'mixins',
                ['provide', 'inject'],
                'ROUTER_GUARDS',
                'layout',
                'middleware',
                'validate',
                'scrollToTop',
                'transition',
                'loading',
                'inheritAttrs',
                'model',
                ['props', 'propsData'],
                'emits',
                'setup',
                'asyncData',
                'data',
                'fetch',
                'head',
                'computed',
                'watch',
                'watchQuery',
                'LIFECYCLE_HOOKS',
                'methods',
                ['template', 'render'],
                'renderError'
            ]
        }],
        'vue/block-lang': ['error',
            {
                'script': {
                    'lang': 'ts'
                }
            }
        ],
        'vue/define-props-declaration': ['error', 'type-based'],
        'vue/component-name-in-template-casing': ['error', 'PascalCase', {
            'registeredComponentsOnly': true,
            'ignores': []
        }],
        'vue/html-indent': ['error', 4, {
            'attribute': 1,
            'baseIndent': 1,
            'closeBracket': 0,
            'alignAttributesVertically': true,
            'ignores': []
        }],
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
    }
};
