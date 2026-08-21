import type { ReactNode } from 'react';
import styles from './WorkflowResultForm.module.scss';

export type WorkflowResultValueProps = {
    children: ReactNode;
};

const WorkflowResultValue = ({ children }: WorkflowResultValueProps) => (
    <span className={styles.UnitValue}>{children}</span>
);

export default WorkflowResultValue;
