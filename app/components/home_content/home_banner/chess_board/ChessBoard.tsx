import {
    CHESS_BOARD_FILES,
    CHESS_BOARD_PIECES,
    CHESS_BOARD_RANKS,
    CHESS_PIECE_ICONS,
    PIECE_COLOR,
} from '@/app/utils/constants'
import classes from './ChessBoard.module.css'

// Draws the decorative top-down chessboard with the pieces from constants
export default function ChessBoard() {
    const boardSquares = CHESS_BOARD_RANKS.flatMap(rank =>
        CHESS_BOARD_FILES.map((file, fileIndex) => {
            const squareName = `${file}${rank}`
            const boardPiece = CHESS_BOARD_PIECES.find(
                piece => piece.square === squareName,
            )
            const darkSquare = (fileIndex + rank) % 2 === 1
            const squareColorClass = darkSquare
                ? classes.chessBoardDarkSquare
                : classes.chessBoardLightSquare
            const squareHighlightClass = boardPiece?.highlighted
                ? classes.chessBoardHighlightedSquare
                : ''
            const pieceColorClass =
                boardPiece?.pieceColor === PIECE_COLOR.muted
                    ? classes.chessBoardMutedPiece
                    : ''

            const pieceIcon = boardPiece ? (
                <span
                    className={`${classes.chessBoardPiece} ${pieceColorClass}`}
                >
                    {CHESS_PIECE_ICONS.get(boardPiece.chessPiece)}
                </span>
            ) : null

            return (
                <div
                    className={`${classes.chessBoardSquare} ${squareColorClass} ${squareHighlightClass}`}
                    key={squareName}
                >
                    {pieceIcon}
                </div>
            )
        }),
    )

    return (
        <div aria-hidden='true' className={classes.chessBoard}>
            {boardSquares}
        </div>
    )
}
