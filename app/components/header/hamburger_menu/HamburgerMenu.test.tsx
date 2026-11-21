import {
    CLOSE_NAVIGATION_MENU_LABEL,
    NAVIGATION_MENU_PANEL_ID,
    OPEN_NAVIGATION_MENU_LABEL,
} from '@/app/utils/constants'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HamburgerMenu from './HamburgerMenu'

// Renders the hamburger menu around one link, as the header does
const renderHamburgerMenu = () =>
    render(
        <HamburgerMenu>
            <a href='#'>{'Services'}</a>
        </HamburgerMenu>,
    )

describe('HamburgerMenu', () => {
    it('is closed when first rendered', () => {
        renderHamburgerMenu()

        const menuButton = screen.getByRole('button', {
            name: OPEN_NAVIGATION_MENU_LABEL,
        })

        expect(menuButton).toHaveAttribute('aria-expanded', 'false')
        expect(menuButton).toHaveAttribute(
            'aria-controls',
            NAVIGATION_MENU_PANEL_ID,
        )
    })

    it('opens when the button is clicked', async () => {
        renderHamburgerMenu()

        await userEvent.click(
            screen.getByRole('button', {name: OPEN_NAVIGATION_MENU_LABEL}),
        )

        expect(
            screen.getByRole('button', {name: CLOSE_NAVIGATION_MENU_LABEL}),
        ).toHaveAttribute('aria-expanded', 'true')
    })

    it('toggles with Enter and Space when the button has focus', async () => {
        renderHamburgerMenu()
        const menuButton = screen.getByRole('button')
        menuButton.focus()

        await userEvent.keyboard('{Enter}')
        const expandedAfterEnter = menuButton.getAttribute('aria-expanded')
        await userEvent.keyboard(' ')

        expect(expandedAfterEnter).toBe('true')
        expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('closes and focuses the button when Escape is pressed', async () => {
        renderHamburgerMenu()
        await userEvent.click(screen.getByRole('button'))
        screen.getByRole('link', {name: 'Services'}).focus()

        await userEvent.keyboard('{Escape}')

        const menuButton = screen.getByRole('button', {
            name: OPEN_NAVIGATION_MENU_LABEL,
        })
        expect(menuButton).toHaveAttribute('aria-expanded', 'false')
        expect(menuButton).toHaveFocus()
    })

    it('closes when a link in the menu is clicked', async () => {
        renderHamburgerMenu()
        await userEvent.click(screen.getByRole('button'))

        await userEvent.click(screen.getByRole('link', {name: 'Services'}))

        expect(screen.getByRole('button')).toHaveAttribute(
            'aria-expanded',
            'false',
        )
    })
})
