module.exports = {
    moduleNameMapper: {
        '\\.(css|jpg|png|svg|less)$': '<rootDir>/../../styleMock.js',
        'nav-(.*)-style': '<rootDir>/../../styleMock.js',
        '@navikt/ds-css': '<rootDir>/../../styleMock.js',
        '\\.\\/userContent': '<rootDir>/../../node_modules/jest-css-modules',
        '\\.\\/systemsStyles': '<rootDir>/../../node_modules/jest-css-modules',
        '\\.\\/header': '<rootDir>/../../node_modules/jest-css-modules',
    },
    transformIgnorePatterns: [
        '<rootDir>.*(node_modules)(?!.*nav.*).*$',
        '<rootDir>/node_modules/(?!@navikt/k9-period-utils/|@navikt/k9-date-utils|@navikt/k9-array-utils|@navikt/k9-bem-utils|@navikt/k9-form-utils|@navikt/ds-icons|@navikt/k9-http-utils)',
    ],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)?$': ["babel-jest", { rootMode: "upward" }],
    },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./setupTests.js'],
};
