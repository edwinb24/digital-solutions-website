import type {Config} from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({dir: './'})

const jestConfig: Config = {
    collectCoverageFrom: [
        'app/**/*.{ts,tsx}',
        '!**/*.generated.ts',
        '!types/__generated__/**',
        '!app/components/lib/**',
        '!**/page.tsx',
        '!**/layout.tsx',
        '!**/*.test.*',
    ],
    coverageDirectory: '<rootDir>/coverage',
    coverageProvider: 'v8',
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
        './app/utils/': {
            branches: 95,
            functions: 100,
            lines: 95,
            statements: 95,
        },
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },
    modulePathIgnorePatterns: ['<rootDir>/.next/'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['/e2e/', '/.next/', '/node_modules/'],
}

export default createJestConfig(jestConfig)
