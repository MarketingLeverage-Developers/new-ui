import type { ReactNode } from 'react';
import classNames from 'classnames';
import styles from './WorkflowForm.module.scss';

export type WorkflowFormFieldProps = {
    children: ReactNode;
    label: ReactNode;
    controlId?: string;
    labelId?: string;
    required?: boolean;
    description?: ReactNode;
    error?: ReactNode;
    className?: string;
};

const WorkflowFormField = ({
    children,
    label,
    controlId,
    labelId,
    required = false,
    description,
    error,
    className,
}: WorkflowFormFieldProps) => (
    <div className={classNames(styles.Field, className)} data-invalid={error ? 'true' : undefined}>
        <label id={labelId} htmlFor={controlId} className={styles.Label}>
            <span>{label}</span>
            {required ? <span className={styles.Required}>*</span> : null}
        </label>
        <div className={styles.Body}>
            {children}
            {description ? <div className={styles.Description}>{description}</div> : null}
            {error ? <div className={styles.Error}>{error}</div> : null}
        </div>
    </div>
);

export default WorkflowFormField;
