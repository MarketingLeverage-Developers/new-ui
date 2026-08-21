import type { ReactNode } from 'react';
import styles from './WorkflowResultForm.module.scss';

export type WorkflowResultUnitProps = {
    index: number;
    control: ReactNode;
    children?: ReactNode;
};

const WorkflowResultUnit = ({ index, control, children }: WorkflowResultUnitProps) => (
    <div className={styles.Unit}>
        <div className={styles.UnitHeader}>
            <span className={styles.UnitIndex}>{index}</span>
            <div className={styles.UnitControl}>{control}</div>
        </div>
        {children ? <div className={styles.UnitDetails}>{children}</div> : null}
    </div>
);

export default WorkflowResultUnit;
