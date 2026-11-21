import type {TypeApproachStep} from '@/app/SharedTypes'
import classes from './ApproachStepEntry.module.css'

// Renders one numbered step of the approach with its description
export default function ApproachStepEntry({
    stepNumber,
    title,
    description,
}: TypeApproachStep) {
    return (
        <li className={classes.approachStepEntry}>
            <h3 className={classes.approachStepEntryTitle}>
                {`${stepNumber}. ${title}`}
            </h3>
            <p className={classes.approachStepEntryDescription}>
                {description}
            </p>
        </li>
    )
}
