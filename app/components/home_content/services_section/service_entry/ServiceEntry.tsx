import type {TypeServiceEntry} from '@/app/SharedTypes'
import {CHESS_PIECE_ICONS} from '@/app/utils/constants'
import classes from './ServiceEntry.module.css'

// Renders one service card with its number label, chess piece and text
export default function ServiceEntry({
    numberLabel,
    title,
    description,
    chessPiece,
}: TypeServiceEntry) {
    return (
        <li className={classes.serviceEntry}>
            <p className={classes.serviceEntryNumberLabel}>{numberLabel}</p>
            <h3 className={classes.serviceEntryTitle}>{title}</h3>
            <p className={classes.serviceEntryDescription}>{description}</p>
            <span className={classes.serviceEntryIcon}>
                {CHESS_PIECE_ICONS.get(chessPiece)}
            </span>
        </li>
    )
}
