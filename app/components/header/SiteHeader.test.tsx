import {
    CLOSE_NAVIGATION_MENU_LABEL,
    HEADER_LOGO_TEXT,
    MENU_PAGE_LINKS,
    OPEN_NAVIGATION_MENU_LABEL,
    START_CONVERSATION_LINK,
} from '@/app/utils/constants'
import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SiteHeader from './SiteHeader'

describe('SiteHeader', () => {
    it('renders the logo, the menu links and the call to action', () => {
        render(<SiteHeader />)

        const header = screen.getByRole('banner')
        const callToAction = within(header).getByRole('link', {
            name: START_CONVERSATION_LINK.title,
        })

        expect(within(header).getByText(HEADER_LOGO_TEXT)).toBeInTheDocument()
        MENU_PAGE_LINKS.forEach(pageLink => {
            expect(
                within(header).getByRole('link', {name: pageLink.title}),
            ).toHaveAttribute('href', pageLink.link)
        })
        expect(callToAction).toHaveAttribute(
            'href',
            START_CONVERSATION_LINK.link,
        )
    })

    it('opens the menu from its button', async () => {
        render(<SiteHeader />)

        await userEvent.click(
            screen.getByRole('button', {name: OPEN_NAVIGATION_MENU_LABEL}),
        )

        expect(
            screen.getByRole('button', {name: CLOSE_NAVIGATION_MENU_LABEL}),
        ).toHaveAttribute('aria-expanded', 'true')
    })

    it('closes the menu and refocuses its button on Escape', async () => {
        render(<SiteHeader />)
        await userEvent.click(screen.getByRole('button'))
        screen.getByRole('link', {name: MENU_PAGE_LINKS[0].title}).focus()

        await userEvent.keyboard('{Escape}')

        const menuButton = screen.getByRole('button', {
            name: OPEN_NAVIGATION_MENU_LABEL,
        })
        expect(menuButton).toHaveAttribute('aria-expanded', 'false')
        expect(menuButton).toHaveFocus()
    })

    it('closes the menu when one of its links is clicked', async () => {
        render(<SiteHeader />)
        await userEvent.click(screen.getByRole('button'))

        await userEvent.click(
            screen.getByRole('link', {name: MENU_PAGE_LINKS[0].title}),
        )

        expect(screen.getByRole('button')).toHaveAttribute(
            'aria-expanded',
            'false',
        )
    })
})
