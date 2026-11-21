import type {
    TypeApproachStep,
    TypeChessBoardPiece,
    TypeHomeBanner,
    TypePageLink,
    TypeServiceEntry,
} from '@/app/SharedTypes'
import type {ReactElement} from 'react'
import BishopIcon from './icons/bishopIcon'
import KingIcon from './icons/kingIcon'
import KnightIcon from './icons/knightIcon'
import PawnIcon from './icons/pawnIcon'
import QueenIcon from './icons/queenIcon'
import RookIcon from './icons/rookIcon'

export enum CHESS_PIECE {
    'bishop' = 'bishop',
    'king' = 'king',
    'knight' = 'knight',
    'pawn' = 'pawn',
    'queen' = 'queen',
    'rook' = 'rook',
}

export enum PIECE_COLOR {
    'light' = 'light',
    'muted' = 'muted',
}

export const COMPANY_NAME = 'E4 Digital Solutions'

export const HEADER_LOGO_TEXT = 'E4 Digital'

export const SERVICES_PAGE: TypePageLink = {
    id: 'services-page-link',
    link: '#',
    title: 'Services',
    __typename: 'MenuItem',
}

export const APPROACH_PAGE: TypePageLink = {
    id: 'approach-page-link',
    link: '#',
    title: 'Approach',
    __typename: 'MenuItem',
}

export const INSIGHT_PAGE: TypePageLink = {
    id: 'insight-page-link',
    link: '#',
    title: 'Insight',
    __typename: 'MenuItem',
}

export const ABOUT_PAGE: TypePageLink = {
    id: 'about-page-link',
    link: '#',
    title: 'About',
    __typename: 'MenuItem',
}

export const MENU_PAGE_LINKS: Array<TypePageLink> = [
    SERVICES_PAGE,
    APPROACH_PAGE,
    INSIGHT_PAGE,
    ABOUT_PAGE,
]

export const START_CONVERSATION_LINK: TypePageLink = {
    id: 'start-conversation-link',
    link: '#',
    title: 'Start a conversation',
    __typename: 'MenuItem',
}

export const BOOK_CODE_REVIEW_LINK: TypePageLink = {
    id: 'book-code-review-link',
    link: '#',
    title: 'Book a code review',
    __typename: 'MenuItem',
}

export const MAIN_NAVIGATION_LABEL = 'Main'

export const FOOTER_NAVIGATION_LABEL = 'Footer'

export const NAVIGATION_MENU_PANEL_ID = 'navigation-menu-panel'

export const OPEN_NAVIGATION_MENU_LABEL = 'Open menu'

export const CLOSE_NAVIGATION_MENU_LABEL = 'Close menu'

export const HOME_BANNER: TypeHomeBanner = {
    eyebrow: 'Secure · Efficient · Built to last',
    headline: 'Think three moves ahead of your code.',
    paragraph:
        'We fix vibe-coded projects, build new applications the right way, and advise on performance, interface and security.',
}

export const SERVICES_SECTION_TITLE = 'Services'

export const SERVICE_ENTRIES: Array<TypeServiceEntry> = [
    {
        id: 'ai-integration',
        numberLabel: '01 — INTEGRATE',
        title: 'AI Integration',
        description:
            'Connect your business seamlessly to the latest AI models, so your company can receive orders from them.',
        chessPiece: CHESS_PIECE.rook,
    },
    {
        id: 'code-doctors',
        numberLabel: '02 — FIX',
        title: 'Code Doctors',
        description:
            'Give us your codebase and let us improve it. We look into the code, correct bugs, refactor, and make it more efficient overall.',
        chessPiece: CHESS_PIECE.knight,
    },
    {
        id: 'ai-solutions',
        numberLabel: '03 — GROW',
        title: 'AI Solutions',
        description:
            'Expand and grow your business with custom solutions built around your operations, such as an AI chat bot, call automation and business finance management.',
        chessPiece: CHESS_PIECE.bishop,
    },
]

export const APPROACH_SECTION_TITLE = 'Our approach: study the board first.'

export const APPROACH_STEPS: Array<TypeApproachStep> = [
    {
        id: 'assess',
        stepNumber: '1',
        title: 'Assess',
        description: 'We read your code and learn how your business runs.',
    },
    {
        id: 'plan',
        stepNumber: '2',
        title: 'Plan',
        description: 'A prioritized plan, with risks and costs stated plainly.',
    },
    {
        id: 'build',
        stepNumber: '3',
        title: 'Build',
        description: 'Secure, tested changes in small, reviewable steps.',
    },
    {
        id: 'hand-over',
        stepNumber: '4',
        title: 'Hand over',
        description: 'Documentation and a codebase your team can own.',
    },
]

export const CHESS_PIECE_ICONS = new Map<CHESS_PIECE, ReactElement>([
    [CHESS_PIECE.bishop, <BishopIcon key={`${CHESS_PIECE.bishop}`} />],
    [CHESS_PIECE.king, <KingIcon key={`${CHESS_PIECE.king}`} />],
    [CHESS_PIECE.knight, <KnightIcon key={`${CHESS_PIECE.knight}`} />],
    [CHESS_PIECE.pawn, <PawnIcon key={`${CHESS_PIECE.pawn}`} />],
    [CHESS_PIECE.queen, <QueenIcon key={`${CHESS_PIECE.queen}`} />],
    [CHESS_PIECE.rook, <RookIcon key={`${CHESS_PIECE.rook}`} />],
])

export const CHESS_BOARD_FILES: Array<string> = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
]

export const CHESS_BOARD_RANKS: Array<number> = [8, 7, 6, 5, 4, 3, 2, 1]

export const CHESS_BOARD_PIECES: Array<TypeChessBoardPiece> = [
    {
        square: 'd6',
        chessPiece: CHESS_PIECE.knight,
        pieceColor: PIECE_COLOR.light,
        highlighted: true,
    },
    {
        square: 'e5',
        chessPiece: CHESS_PIECE.pawn,
        pieceColor: PIECE_COLOR.muted,
        highlighted: false,
    },
    {
        square: 'f7',
        chessPiece: CHESS_PIECE.king,
        pieceColor: PIECE_COLOR.muted,
        highlighted: true,
    },
    {
        square: 'c4',
        chessPiece: CHESS_PIECE.bishop,
        pieceColor: PIECE_COLOR.light,
        highlighted: false,
    },
    {
        square: 'g4',
        chessPiece: CHESS_PIECE.rook,
        pieceColor: PIECE_COLOR.light,
        highlighted: false,
    },
    {
        square: 'b6',
        chessPiece: CHESS_PIECE.pawn,
        pieceColor: PIECE_COLOR.muted,
        highlighted: false,
    },
    {
        square: 'e3',
        chessPiece: CHESS_PIECE.queen,
        pieceColor: PIECE_COLOR.light,
        highlighted: false,
    },
]
