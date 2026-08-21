import type { ReactNode } from 'react';
import styles from './WorkflowResultForm.module.scss';

export type WorkflowResultMetric = {
    label: ReactNode;
    value: ReactNode;
    suffix?: ReactNode;
};

export type WorkflowResultMetricsProps = {
    items: WorkflowResultMetric[];
};

const WorkflowResultMetrics = ({ items }: WorkflowResultMetricsProps) => (
    <div className={styles.MetricGrid}>
        {items.map((item, index) => (
            <div key={index} className={styles.Metric}>
                <span>{item.label}</span>
                <strong>
                    {item.value}
                    {item.suffix ? <small>{item.suffix}</small> : null}
                </strong>
            </div>
        ))}
    </div>
);

export default WorkflowResultMetrics;
