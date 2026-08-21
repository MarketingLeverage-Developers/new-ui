import type { ReactNode } from 'react';
import classNames from 'classnames';
import styles from './WorkflowResultForm.module.scss';

export type WorkflowResultFieldProps = {
    label: ReactNode;
    children: ReactNode;
    className?: string;
};

const WorkflowResultField = ({ label, children, className }: WorkflowResultFieldProps) => (
    <div className={classNames(styles.Field, className)}>
        <span className={styles.FieldLabel}>{label}</span>
        {children}
    </div>
);

export default WorkflowResultField;
