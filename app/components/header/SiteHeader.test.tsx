import {
    HEADER_LOGO_TEXT,
    MENU_PAGE_LINKS,
    START_CONVERSATION_LINK,
} from '@/app/utils/constants'
import {render, screen, within} from '@testing-library/react'
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
})
