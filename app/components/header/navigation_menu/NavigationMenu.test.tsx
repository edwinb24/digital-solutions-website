import {MAIN_NAVIGATION_LABEL, MENU_PAGE_LINKS} from '@/app/utils/constants'
import {render, screen, within} from '@testing-library/react'
import NavigationMenu from './NavigationMenu'

describe('NavigationMenu', () => {
    it('renders the menu links in order when rendered', () => {
        render(<NavigationMenu />)

        const navigation = screen.getByRole('navigation', {
            name: MAIN_NAVIGATION_LABEL,
        })
        const menuLinks = within(navigation).getAllByRole('link')

        expect(menuLinks.map(menuLink => menuLink.textContent)).toEqual(
            MENU_PAGE_LINKS.map(pageLink => pageLink.title),
        )
        menuLinks.forEach((menuLink, index) => {
            expect(menuLink).toHaveAttribute(
                'href',
                MENU_PAGE_LINKS[index].link,
            )
        })
    })
})
