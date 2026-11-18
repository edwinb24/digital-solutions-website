import {APPROACH_SECTION_TITLE, APPROACH_STEPS} from '@/app/utils/constants'
import {render, screen} from '@testing-library/react'
import ApproachSection from './ApproachSection'

describe('ApproachSection', () => {
    it('renders the heading and the four steps in order', () => {
        render(<ApproachSection />)

        const stepTitles = screen.getAllByRole('heading', {level: 3})

        expect(
            screen.getByRole('heading', {
                level: 2,
                name: APPROACH_SECTION_TITLE,
            }),
        ).toBeInTheDocument()
        expect(screen.getByRole('list').tagName).toBe('OL')
        expect(stepTitles.map(title => title.textContent)).toEqual(
            APPROACH_STEPS.map(
                approachStep =>
                    `${approachStep.stepNumber}. ${approachStep.title}`,
            ),
        )
    })
})
