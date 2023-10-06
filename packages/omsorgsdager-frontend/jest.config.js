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
        '<rootDir>/node_modules/(?!@navikt/k9-fe-period-utils/|@navikt/k9-fe-date-utils|@navikt/k9-fe-array-utils|@navikt/k9-fe-bem-utils|@navikt/k9-fe-form-utils|@navikt/ds-icons|@navikt/k9-fe-http-utils)',
    ],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)?$': ["babel-jest", { rootMode: "upward" }],
    },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['./setupTests.ts'],
};
