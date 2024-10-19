module.exports = {
    testEnvironment: 'node',
    roots: ['src'],
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1", // Map imports with .js extensions
    },
    transform: {},
    setupFiles: ['./src/services/db.service.js']
};