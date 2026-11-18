import {BOOK_CODE_REVIEW_LINK, HOME_BANNER} from '@/app/utils/constants'
import Link from 'next/link'
import ChessBoard from './chess_board/ChessBoard'
import classes from './HomeBanner.module.css'

// Renders the chessboard banner with the headline and the main call to action
export default function HomeBanner() {
    return (
        <section className={classes.homeBanner}>
            <ChessBoard />
            <div className={classes.homeBannerContent}>
                <p className={classes.homeBannerEyebrow}>
                    {HOME_BANNER.eyebrow}
                </p>
                <h1 className={classes.homeBannerHeadline}>
                    {HOME_BANNER.headline}
                </h1>
                <p className={classes.homeBannerParagraph}>
                    {HOME_BANNER.paragraph}
                </p>
                <Link
                    className={classes.homeBannerCallToAction}
                    href={BOOK_CODE_REVIEW_LINK.link}
                >
                    {BOOK_CODE_REVIEW_LINK.title}
                </Link>
            </div>
        </section>
    )
}
