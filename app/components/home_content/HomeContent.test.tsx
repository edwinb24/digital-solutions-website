import {
    APPROACH_SECTION_TITLE,
    HOME_BANNER,
    SERVICES_SECTION_TITLE,
} from '@/app/utils/constants'
import {render, screen} from '@testing-library/react'
import HomeContent from './HomeContent'

describe('HomeContent', () => {
    it('renders one main landmark with a single h1', () => {
        render(<HomeContent />)

        expect(screen.getAllByRole('main')).toHaveLength(1)
        expect(screen.getAllByRole('heading', {level: 1})).toHaveLength(1)
        expect(
            screen.getByRole('heading', {level: 1, name: HOME_BANNER.headline}),
        ).toBeInTheDocument()
    })

    it('renders the banner, services and approach sections in order', () => {
        render(<HomeContent />)

        const sectionHeadings = screen
            .getAllByRole('heading')
            .filter(heading => ['H1', 'H2'].includes(heading.tagName))

        expect(sectionHeadings.map(heading => heading.textContent)).toEqual([
            HOME_BANNER.headline,
            SERVICES_SECTION_TITLE,
            APPROACH_SECTION_TITLE,
        ])
    })
})
