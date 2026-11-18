import {SERVICE_ENTRIES, SERVICES_SECTION_TITLE} from '@/app/utils/constants'
import {render, screen} from '@testing-library/react'
import ServicesSection from './ServicesSection'

describe('ServicesSection', () => {
    it('renders the heading and the three services in order', () => {
        render(<ServicesSection />)

        const serviceTitles = screen.getAllByRole('heading', {level: 3})

        expect(
            screen.getByRole('heading', {
                level: 2,
                name: SERVICES_SECTION_TITLE,
            }),
        ).toBeInTheDocument()
        expect(screen.getAllByRole('listitem')).toHaveLength(3)
        expect(serviceTitles.map(title => title.textContent)).toEqual(
            SERVICE_ENTRIES.map(service => service.title),
        )
    })
})
