module.exports = {
  extends: [
    'react-app'
  ],
  rules: {
    '@typescript-eslint/member-delimiter-style': ['error'],
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-use-before-define': ['error'],
    '@typescript-eslint/semi': ['error'],
    '@typescript-eslint/type-annotation-spacing': ['error'],
    'jsx-quotes': [2, 'prefer-double'],
    'no-var': 2,
    'prefer-const': 2,
    'react/jsx-max-props-per-line': ['error', {'maximum': 1, 'when': 'multiline'}],
    'sort-imports': [2, {'allowSeparatedGroups': true, 'ignoreDeclarationSort': true}]
  },
  overrides: [
    {
      files: ['**/*.ts?(x)']
    }
  ]
};
