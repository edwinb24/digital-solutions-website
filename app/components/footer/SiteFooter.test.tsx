import {
    COMPANY_NAME,
    FOOTER_NAVIGATION_LABEL,
    MENU_PAGE_LINKS,
} from '@/app/utils/constants'
import {render, screen, within} from '@testing-library/react'
import SiteFooter from './SiteFooter'

describe('SiteFooter', () => {
    it('renders the logo text and the menu links when rendered', () => {
        render(<SiteFooter />)

        const footer = screen.getByRole('contentinfo')
        const footerNavigation = within(footer).getByRole('navigation', {
            name: FOOTER_NAVIGATION_LABEL,
        })
        const footerLinks = within(footerNavigation).getAllByRole('link')

        expect(within(footer).getByText(COMPANY_NAME)).toBeInTheDocument()
        expect(footerLinks).toHaveLength(MENU_PAGE_LINKS.length)
        MENU_PAGE_LINKS.forEach((pageLink, index) => {
            expect(footerLinks[index]).toHaveTextContent(pageLink.title)
            expect(footerLinks[index]).toHaveAttribute('href', pageLink.link)
        })
    })
})
