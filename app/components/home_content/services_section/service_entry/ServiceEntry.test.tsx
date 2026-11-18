import type {TypeServiceEntry} from '@/app/SharedTypes'
import {CHESS_PIECE} from '@/app/utils/constants'
import {render, screen} from '@testing-library/react'
import ServiceEntry from './ServiceEntry'

describe('ServiceEntry', () => {
    it('renders the label, title and description with a hidden icon', () => {
        const serviceFixture: TypeServiceEntry = {
            id: 'code-doctors',
            numberLabel: '02 — FIX',
            title: 'Code Doctors',
            description: 'We correct bugs and refactor your codebase.',
            chessPiece: CHESS_PIECE.knight,
        }

        const {container} = render(
            <ul>
                <ServiceEntry {...serviceFixture} />
            </ul>,
        )

        expect(
            screen.getByRole('heading', {name: serviceFixture.title}),
        ).toBeInTheDocument()
        expect(
            screen.getByText(serviceFixture.numberLabel),
        ).toBeInTheDocument()
        expect(
            screen.getByText(serviceFixture.description),
        ).toBeInTheDocument()
        expect(container.querySelector('svg')).toHaveAttribute(
            'aria-hidden',
            'true',
        )
    })
})
