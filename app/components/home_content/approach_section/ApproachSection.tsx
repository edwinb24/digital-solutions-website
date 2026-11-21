import sharedClasses from '@/app/sharedStyles.module.css'
import {APPROACH_SECTION_TITLE, APPROACH_STEPS} from '@/app/utils/constants'
import ApproachStepEntry from './approach_step_entry/ApproachStepEntry'
import classes from './ApproachSection.module.css'

// Renders the four steps of how E4 works on a light section
export default function ApproachSection() {
    const approachStepEntries = APPROACH_STEPS.map(approachStep => (
        <ApproachStepEntry key={approachStep.id} {...approachStep} />
    ))

    return (
        <section className={classes.approachSection}>
            <div className={sharedClasses.pageWideWrapper}>
                <h2 className={classes.approachSectionTitle}>
                    {APPROACH_SECTION_TITLE}
                </h2>
                <ol className={classes.approachSectionSteps}>
                    {approachStepEntries}
                </ol>
            </div>
        </section>
    )
}
