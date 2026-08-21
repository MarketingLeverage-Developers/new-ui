import type { ReactNode } from 'react';
import styles from './WorkflowResultForm.module.scss';

export type WorkflowResultStatusTone = 'default' | 'ready' | 'error';

export type WorkflowResultStatusProps = {
    children: ReactNode;
    icon?: ReactNode;
    tone?: WorkflowResultStatusTone;
};

const WorkflowResultStatus = ({ children, icon, tone = 'default' }: WorkflowResultStatusProps) => (
    <div className={styles.Status} data-tone={tone}>
        {icon ? <span className={styles.StatusIcon}>{icon}</span> : null}
        <strong>{children}</strong>
    </div>
);

export default WorkflowResultStatus;
