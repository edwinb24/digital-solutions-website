import {defineConfig, globalIgnores} from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const ABBREVIATED_NAMES = [
    'btn',
    'cfg',
    'ctx',
    'dt',
    'el',
    'i',
    'idx',
    'img',
    'ind',
    'msg',
    'res',
]

const CLICK_AND_KEY_HANDLERS = [
    'onClick',
    'onKeyDown',
    'onKeyPress',
    'onKeyUp',
    'onMouseDown',
    'onMouseUp',
]

const GLOBAL_ERROR_FILES = ['**/app/global-error.tsx']

const HTML_PARSER_HANDLER_FILES = ['**/utils/htmlHandler.ts']

const HTML_PARSER_IMPORT_PATTERN = {
    regex: '^html-react-parser(/|$)',
    message: 'Render CMS HTML with parseCmsHtml() from the htmlHandler.',
}

const STRING_LITERAL_PATTERN = "('[^']*'|\"[^\"]*\"|`.*`)"

const MAX_LINE_LENGTH_EXEMPTIONS = [
    String.raw`^import\s+(type\s+)?(\w+|\{\s*(type\s+)?\w+\s*\})\s+from\s`,
    String.raw`^\s*\} from\s`,
    String.raw`^\s*(\w+:\s*|\w+\s*=\s*|return\s+|[?:]\s+)?` +
        STRING_LITERAL_PATTERN +
        String.raw`[,;)\]}]*$`,
    String.raw`^\s*[-\w]+=\{?` +
        STRING_LITERAL_PATTERN +
        String.raw`\}?\s*\/?>?$`,
    String.raw`^\s*\{` + STRING_LITERAL_PATTERN + String.raw`\}$`,
]

const PRETTIER_TERNARY_NODES = [
    'ConditionalExpression',
    'ConditionalExpression > ArrayExpression',
    'ConditionalExpression > ArrayExpression > *',
]

const RESTRICTED_IMPORT_PATTERNS = [
    {
        regex: '^\\.\\.(/|$)',
        message: 'Import from parent folders through an alias, never ../',
    },
    {
        regex: '^@emotion/',
        message: 'Emotion is only a peer dependency of the MUI icons.',
    },
    {
        regex: '^@mui/(?!icons-material(/|$)|material/SvgIcon$)',
        message: 'Use MUI only for icons: icons-material or material/SvgIcon.',
    },
    {
        regex: '^rxjs(/|$)',
        message: 'rxjs is only a peer dependency of Apollo Client.',
    },
]

const UNUSED_NAME_PATTERN = '^_+$'

const eslintConfig = defineConfig([
    ...nextCoreWebVitals,
    ...nextTypescript,
    {
        rules: {
            '@typescript-eslint/array-type': ['error', {default: 'generic'}],
            '@typescript-eslint/consistent-indexed-object-style': [
                'error',
                'record',
            ],
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    prefer: 'type-imports',
                    fixStyle: 'inline-type-imports',
                },
            ],
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'default',
                    format: null,
                },
                {
                    selector: 'variable',
                    format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
                },
                {
                    selector: 'function',
                    format: ['camelCase', 'PascalCase'],
                },
                {
                    selector: 'parameter',
                    format: ['camelCase', 'PascalCase'],
                },
                {
                    selector: ['variable', 'parameter'],
                    modifiers: ['destructured'],
                    format: null,
                },
                {
                    selector: ['variable', 'parameter'],
                    filter: {regex: UNUSED_NAME_PATTERN, match: true},
                    format: null,
                },
                {
                    selector: 'typeLike',
                    format: ['PascalCase'],
                },
                {
                    selector: 'enum',
                    format: ['UPPER_CASE'],
                },
            ],
            '@typescript-eslint/no-import-type-side-effects': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: UNUSED_NAME_PATTERN,
                    caughtErrorsIgnorePattern: UNUSED_NAME_PATTERN,
                    destructuredArrayIgnorePattern: UNUSED_NAME_PATTERN,
                    varsIgnorePattern: UNUSED_NAME_PATTERN,
                },
            ],
            'arrow-parens': ['error', 'as-needed'],
            'brace-style': ['error', '1tbs', {allowSingleLine: true}],
            'comma-dangle': ['error', 'always-multiline'],
            curly: ['error', 'multi-line'],
            'eol-last': ['error', 'always'],
            'id-denylist': ['error', ...ABBREVIATED_NAMES],
            'id-length': [
                'error',
                {min: 2, exceptions: ['e', '_'], properties: 'never'},
            ],
            indent: [
                'error',
                4,
                {SwitchCase: 1, ignoredNodes: PRETTIER_TERNARY_NODES},
            ],
            'jsx-a11y/click-events-have-key-events': 'error',
            'jsx-a11y/interactive-supports-focus': 'error',
            'jsx-a11y/no-noninteractive-element-interactions': [
                'error',
                {handlers: CLICK_AND_KEY_HANDLERS},
            ],
            'jsx-a11y/no-static-element-interactions': [
                'error',
                {allowExpressionValues: true, handlers: CLICK_AND_KEY_HANDLERS},
            ],
            'jsx-quotes': ['error', 'prefer-single'],
            'max-len': [
                'error',
                {
                    code: 80,
                    tabWidth: 4,
                    ignorePattern: MAX_LINE_LENGTH_EXEMPTIONS.join('|'),
                    ignoreUrls: true,
                },
            ],
            'no-console': ['error', {allow: ['error']}],
            'no-duplicate-imports': 'error',
            'no-multiple-empty-lines': [
                'error',
                {max: 1, maxBOF: 0, maxEOF: 0},
            ],
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        ...RESTRICTED_IMPORT_PATTERNS,
                        HTML_PARSER_IMPORT_PATTERN,
                    ],
                },
            ],
            'no-tabs': 'error',
            'object-curly-spacing': ['error', 'never'],
            quotes: [
                'error',
                'single',
                {avoidEscape: true, allowTemplateLiterals: false},
            ],
            'react/forbid-component-props': [
                'error',
                {forbid: ['style', 'sx']},
            ],
            'react/forbid-dom-props': ['error', {forbid: ['style']}],
            'react/jsx-curly-brace-presence': [
                'error',
                {props: 'never', children: 'ignore'},
            ],
            'react/no-danger': 'error',
            'react/self-closing-comp': [
                'error',
                {component: true, html: false},
            ],
            semi: ['error', 'never'],
            'sort-imports': [
                'error',
                {ignoreCase: true, ignoreDeclarationSort: true},
            ],
        },
    },
    {
        files: HTML_PARSER_HANDLER_FILES,
        rules: {
            'no-restricted-imports': [
                'error',
                {patterns: RESTRICTED_IMPORT_PATTERNS},
            ],
        },
    },
    {
        files: GLOBAL_ERROR_FILES,
        rules: {
            'react/forbid-dom-props': 'off',
        },
    },
    globalIgnores([
        '.next/**',
        'out/**',
        'build/**',
        'coverage/**',
        'next-env.d.ts',
        '**/__generated__/**',
        '**/*.generated.ts',
    ]),
])

export default eslintConfig
