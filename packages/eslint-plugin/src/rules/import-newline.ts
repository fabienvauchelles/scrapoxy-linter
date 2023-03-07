// Based on work of Anton Antonov (foxic[AT]foxic[DOT]ru)
// https://github.com/gmsorrow/eslint-plugin-modules-newline.git
// We only keep the import part and translate into typescript
import {
    ESLintUtils,
    TSESTree,
} from '@typescript-eslint/utils';


type Options = [];
type MessageIds = 'newline';


const createRule = ESLintUtils.RuleCreator((name) => `https://scrapoxy.io/rule/${name}`);

export default createRule<Options, MessageIds>({
    name: 'import-newline',
    meta: {
        type: 'layout',
        docs: {
            description: 'Enforce destructuring import with multiple items on a newline',
            recommended: 'error',
        },
        fixable: 'code',
        schema: [],
        messages: {
            newline: 'Each imported variable should starts with a new line.',
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            ImportDeclaration(node) {
                if (!node.specifiers ||
                    node.specifiers.length < 2) {
                    return;
                }

                const sourceCode = context.getSourceCode();

                for (let i = 1; i < node.specifiers.length; i++) {
                    const firstTokenOfCurrentProperty = sourceCode.getFirstToken(node.specifiers[ i ]);

                    if (firstTokenOfCurrentProperty) {

                        if (node.specifiers[ i ].loc.start.line === node.specifiers[ i - 1 ].loc.start.line) {
                            const code = context.getSourceCode();

                            if (
                                node.specifiers[ i ].type === 'ImportSpecifier' &&
                                node.specifiers[ i - 1 ] &&
                                node.specifiers[ i - 1 ].type === 'ImportDefaultSpecifier'
                            ) {
                                if (node.specifiers.length <= 2) {
                                    return;
                                }

                                const endOfDefaultImport = node.specifiers[ i - 1 ].range[ 1 ];
                                const beginningOfNamedImport = node.specifiers[ i ].range[ 0 ];
                                const brace = code.tokensAndComments.find((token) => token.type === 'Punctuator'
                                    && token.value === '{'
                                    && token.range[ 0 ] >= endOfDefaultImport
                                    && token.range[ 1 ] <= beginningOfNamedImport) as TSESTree.Token;
                                const rangeAfterBrace: [number, number] = [
                                    brace.range[ 0 ], brace!.range[ 1 ],
                                ];

                                context.report({
                                    node,
                                    messageId: 'newline',
                                    fix: (fixer) => fixer.replaceTextRange(
                                        rangeAfterBrace,
                                        '{\n'
                                    ),
                                });
                            } else {
                                const comma = code.getTokenBefore(firstTokenOfCurrentProperty);
                                const rangeAfterComma: [number, number] = [
                                    comma!.range[ 1 ], firstTokenOfCurrentProperty.range[ 0 ],
                                ];

                                // don't fix if comments between the comma and the next property.
                                if (code.text.slice(
                                    rangeAfterComma[ 0 ],
                                    rangeAfterComma[ 1 ]
                                )
                                    .trim()) {
                                    return;
                                }

                                context.report({
                                    node,
                                    messageId: 'newline',
                                    fix: (fixer) => fixer.replaceTextRange(
                                        rangeAfterComma,
                                        '\n'
                                    ),
                                });
                            }
                        }
                    }
                }
            },
        };
    },
});
