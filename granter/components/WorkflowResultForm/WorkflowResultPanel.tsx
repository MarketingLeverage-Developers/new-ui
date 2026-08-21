import type { ReactNode } from 'react';
import styles from './WorkflowResultForm.module.scss';

export type WorkflowResultPanelProps = {
    title: ReactNode;
    description?: ReactNode;
    meta?: ReactNode;
    icon?: ReactNode;
    children?: ReactNode;
};

const WorkflowResultPanel = ({
    title,
    description,
    meta,
    icon,
    children,
}: WorkflowResultPanelProps) => (
    <section className={styles.Panel}>
        <header className={styles.PanelHeader} data-has-body={children ? 'true' : undefined}>
            <span className={styles.PanelIcon} aria-hidden="true">{icon}</span>
            <span className={styles.PanelCopy}>
                <strong>{title}</strong>
                {description ? <small>{description}</small> : null}
            </span>
            {meta ? <span className={styles.PanelMeta}>{meta}</span> : null}
        </header>
        {children ? <div className={styles.PanelBody}>{children}</div> : null}
    </section>
);

export default WorkflowResultPanel;
