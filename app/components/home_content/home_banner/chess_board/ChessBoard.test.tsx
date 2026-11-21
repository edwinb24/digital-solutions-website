import {CHESS_BOARD_PIECES} from '@/app/utils/constants'
import {render} from '@testing-library/react'
import ChessBoard from './ChessBoard'

describe('ChessBoard', () => {
    it('renders 64 squares and every configured piece', () => {
        const {container} = render(<ChessBoard />)

        const chessBoard = container.firstElementChild

        expect(chessBoard?.children).toHaveLength(64)
        expect(chessBoard?.querySelectorAll('svg')).toHaveLength(
            CHESS_BOARD_PIECES.length,
        )
    })

    it('is hidden from assistive technology because it is decorative', () => {
        const {container} = render(<ChessBoard />)

        const chessBoard = container.firstElementChild

        expect(chessBoard).toHaveAttribute('aria-hidden', 'true')
    })
})
