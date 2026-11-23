import {expect, test} from '@playwright/test'

const ERROR_FALLBACK_TEXTS = [
    'Error Loading this Element',
    'Element Failed to Load',
]

test.describe('Home page', () => {
    test('responds with status 200 when visited', async ({page}) => {
        const response = await page.goto('/')

        expect(response?.status()).toBe(200)
    })

    test('shows the main heading when loaded', async ({page}) => {
        await page.goto('/')

        await expect(page.getByRole('heading', {level: 1})).toBeVisible()
    })

    test('shows no error fallback when loaded', async ({page}) => {
        await page.goto('/')

        await expect(page.getByRole('heading', {level: 1})).toBeVisible()
        for (const errorFallbackText of ERROR_FALLBACK_TEXTS) {
            await expect(
                page.getByText(errorFallbackText, {exact: true}),
            ).toHaveCount(0)
        }
    })
})
