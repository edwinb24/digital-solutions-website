import type {TypeApproachStep} from '@/app/SharedTypes'
import {render, screen} from '@testing-library/react'
import ApproachStepEntry from './ApproachStepEntry'

describe('ApproachStepEntry', () => {
    it('renders the number, title and description', () => {
        const approachStepFixture: TypeApproachStep = {
            id: 'assess',
            stepNumber: '1',
            title: 'Assess',
            description: 'We read your code and learn how your business runs.',
        }

        render(
            <ol>
                <ApproachStepEntry {...approachStepFixture} />
            </ol>,
        )

        expect(
            screen.getByRole('heading', {name: '1. Assess'}),
        ).toBeInTheDocument()
        expect(
            screen.getByText(approachStepFixture.description),
        ).toBeInTheDocument()
    })
})
