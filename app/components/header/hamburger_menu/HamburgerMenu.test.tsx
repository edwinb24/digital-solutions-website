import {
    CLOSE_NAVIGATION_MENU_LABEL,
    NAVIGATION_MENU_PANEL_ID,
    OPEN_NAVIGATION_MENU_LABEL,
} from '@/app/utils/constants'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HamburgerMenu from './HamburgerMenu'

describe('HamburgerMenu', () => {
    it('offers to open the menu when it is closed', () => {
        render(
            <HamburgerMenu
                hamburgerOpen={false}
                ref={null}
                onToggle={jest.fn()}
            />,
        )

        const menuButton = screen.getByRole('button', {
            name: OPEN_NAVIGATION_MENU_LABEL,
        })

        expect(menuButton).toHaveAttribute('aria-expanded', 'false')
        expect(menuButton).toHaveAttribute(
            'aria-controls',
            NAVIGATION_MENU_PANEL_ID,
        )
    })

    it('offers to close the menu when it is open', () => {
        render(
            <HamburgerMenu hamburgerOpen ref={null} onToggle={jest.fn()} />,
        )

        expect(
            screen.getByRole('button', {name: CLOSE_NAVIGATION_MENU_LABEL}),
        ).toHaveAttribute('aria-expanded', 'true')
    })

    it('toggles on click, Enter and Space', async () => {
        const onToggle = jest.fn()
        render(
            <HamburgerMenu
                hamburgerOpen={false}
                ref={null}
                onToggle={onToggle}
            />,
        )
        const menuButton = screen.getByRole('button')

        await userEvent.click(menuButton)
        await userEvent.keyboard('{Enter}')
        await userEvent.keyboard(' ')

        expect(onToggle).toHaveBeenCalledTimes(3)
    })
})
