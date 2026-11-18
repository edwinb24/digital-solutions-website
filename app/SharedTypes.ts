import type {CHESS_PIECE, PIECE_COLOR} from '@/app/utils/constants'

export type TypePageLink = {
    id: string
    link: string
    title: string
    __typename: string
}

export type TypeHomeBanner = {
    eyebrow: string
    headline: string
    paragraph: string
}

export type TypeServiceEntry = {
    id: string
    numberLabel: string
    title: string
    description: string
    chessPiece: CHESS_PIECE
}

export type TypeApproachStep = {
    id: string
    stepNumber: string
    title: string
    description: string
}

export type TypeChessBoardPiece = {
    square: string
    chessPiece: CHESS_PIECE
    pieceColor: PIECE_COLOR
    highlighted: boolean
}
