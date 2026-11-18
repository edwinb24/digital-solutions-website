import {defineConfig, devices} from '@playwright/test'

const BASE_URL = 'http://localhost:3000'

const MOBILE_VIEWPORT = {width: 390, height: 844}

export default defineConfig({
    projects: [
        {
            name: 'desktop',
            use: {...devices['Desktop Chrome']},
        },
        {
            name: 'mobile',
            use: {...devices['Pixel 7'], viewport: MOBILE_VIEWPORT},
        },
    ],
    testDir: './e2e',
    use: {
        baseURL: BASE_URL,
    },
    webServer: {
        command: 'yarn dev',
        reuseExistingServer: !process.env.CI,
        url: BASE_URL,
    },
})
