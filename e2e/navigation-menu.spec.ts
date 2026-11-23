import {
    CLOSE_NAVIGATION_MENU_LABEL,
    MAIN_NAVIGATION_LABEL,
    MENU_PAGE_LINKS,
    OPEN_NAVIGATION_MENU_LABEL,
    START_CONVERSATION_LINK,
} from '@/app/utils/constants'
import {expect, type Page, test} from '@playwright/test'

// Finds the main navigation inside the site header
const getMainNavigation = (page: Page) =>
    page
        .getByRole('banner')
        .getByRole('navigation', {name: MAIN_NAVIGATION_LABEL})

test.describe('Navigation menu on desktop', () => {
    test.skip(({isMobile}) => isMobile, 'Desktop layout only')

    test('shows every menu link when loaded', async ({page}) => {
        await page.goto('/')

        const mainNavigation = getMainNavigation(page)
        for (const pageLink of MENU_PAGE_LINKS) {
            await expect(
                mainNavigation.getByRole('link', {
                    exact: true,
                    name: pageLink.title,
                }),
            ).toBeVisible()
        }
    })

    test('shows the call to action when loaded', async ({page}) => {
        await page.goto('/')

        await expect(
            page.getByRole('banner').getByRole('link', {
                name: START_CONVERSATION_LINK.title,
            }),
        ).toBeVisible()
    })

    test('hides the menu button when loaded', async ({page}) => {
        await page.goto('/')

        await expect(getMainNavigation(page)).toBeVisible()
        await expect(
            page.getByRole('button', {name: OPEN_NAVIGATION_MENU_LABEL}),
        ).toBeHidden()
    })
})

test.describe('Navigation menu on mobile', () => {
    test.skip(({isMobile}) => !isMobile, 'Mobile layout only')

    test('hides the menu links when loaded', async ({page}) => {
        await page.goto('/')

        await expect(
            page.getByRole('button', {name: OPEN_NAVIGATION_MENU_LABEL}),
        ).toBeVisible()
        for (const pageLink of MENU_PAGE_LINKS) {
            await expect(
                getMainNavigation(page).getByRole('link', {
                    exact: true,
                    name: pageLink.title,
                }),
            ).toBeHidden()
        }
    })

    test('shows the menu links when the button is pressed', async ({page}) => {
        await page.goto('/')

        await page
            .getByRole('button', {name: OPEN_NAVIGATION_MENU_LABEL})
            .click()

        await expect(
            page.getByRole('button', {name: CLOSE_NAVIGATION_MENU_LABEL}),
        ).toHaveAttribute('aria-expanded', 'true')
        for (const pageLink of MENU_PAGE_LINKS) {
            await expect(
                getMainNavigation(page).getByRole('link', {
                    exact: true,
                    name: pageLink.title,
                }),
            ).toBeVisible()
        }
    })

    test('closes the menu and refocuses the button on Escape', async ({
        page,
    }) => {
        await page.goto('/')
        await page
            .getByRole('button', {name: OPEN_NAVIGATION_MENU_LABEL})
            .click()
        await expect(getMainNavigation(page)).toBeVisible()
        await getMainNavigation(page)
            .getByRole('link', {exact: true, name: MENU_PAGE_LINKS[0].title})
            .focus()

        await page.keyboard.press('Escape')

        await expect(getMainNavigation(page)).toBeHidden()
        await expect(
            page.getByRole('button', {name: OPEN_NAVIGATION_MENU_LABEL}),
        ).toBeFocused()
    })
})
