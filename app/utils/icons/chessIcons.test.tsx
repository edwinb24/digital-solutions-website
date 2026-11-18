import {render, screen} from '@testing-library/react'
import BishopIcon from './bishopIcon'
import KingIcon from './kingIcon'
import KnightIcon from './knightIcon'
import PawnIcon from './pawnIcon'
import QueenIcon from './queenIcon'
import RookIcon from './rookIcon'

describe.each([
    ['BishopIcon', BishopIcon],
    ['KingIcon', KingIcon],
    ['KnightIcon', KnightIcon],
    ['PawnIcon', PawnIcon],
    ['QueenIcon', QueenIcon],
    ['RookIcon', RookIcon],
])('%s', (_, ChessIcon) => {
    it('renders a decorative 1em svg when no props are passed', () => {
        const {container} = render(<ChessIcon />)

        const iconElement = container.querySelector('svg')

        expect(iconElement).toHaveAttribute('aria-hidden', 'true')
        expect(iconElement).toHaveAttribute('focusable', 'false')
        expect(iconElement).toHaveAttribute('fill', 'currentColor')
        expect(iconElement).toHaveAttribute('width', '1em')
        expect(iconElement).toHaveAttribute('height', '1em')
        expect(iconElement).toHaveAttribute('viewBox', '0 0 32 32')
        expect(iconElement?.childElementCount).toBeGreaterThan(0)
    })

    it('passes a className and extra svg props through when given', () => {
        render(
            <ChessIcon
                aria-hidden='false'
                aria-label='Chess piece'
                className='pieceIcon'
                role='img'
            />,
        )

        const iconElement = screen.getByRole('img', {name: 'Chess piece'})

        expect(iconElement).toHaveClass('pieceIcon')
        expect(iconElement).toHaveAttribute('aria-hidden', 'false')
    })
})
