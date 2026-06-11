import type { CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './RequestStatusCompactProgress.module.scss';

export type RequestStatusCompactProgressStep = {
    key: string;
    label: ReactNode;
};

export type RequestStatusCompactProgressProps = {
    steps: RequestStatusCompactProgressStep[];
    currentIndex: number;
    title?: ReactNode;
    statusLabel?: ReactNode;
    helperText?: ReactNode;
    color?: string;
    ariaLabel?: string;
    className?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const renderEmpty = (value: ReactNode) => {
    if (value === null || value === undefined || value === '') return '-';
    return value;
};

const RequestStatusCompactProgress = ({
    steps,
    currentIndex,
    title = '진행 상태',
    statusLabel,
    helperText,
    color = '#f97316',
    ariaLabel = '진행 상태',
    className,
}: RequestStatusCompactProgressProps) => {
    const hasSteps = steps.length > 0;
    const lastIndex = Math.max(steps.length - 1, 0);
    const hasProgress = hasSteps && currentIndex >= 0;
    const safeCurrentIndex = hasProgress ? clamp(currentIndex, 0, lastIndex) : -1;
    const currentStepNumber = hasProgress ? safeCurrentIndex + 1 : 0;
    const resolvedStatusLabel = renderEmpty(statusLabel ?? (hasProgress ? steps[safeCurrentIndex]?.label : null));

    return (
        <section
            className={classNames(styles.Root, className)}
            style={{ '--request-status-color': color } as CSSProperties}
            aria-label={ariaLabel}
            role="group"
        >
            <span className={styles.Title}>{title}</span>

            <div
                className={styles.Track}
                role="progressbar"
                aria-valuenow={currentStepNumber}
                aria-valuemin={0}
                aria-valuemax={steps.length}
            >
                <span className={styles.StatusPill}>
                    <span className={styles.StatusDot} aria-hidden="true" />
                    {resolvedStatusLabel}
                </span>
            </div>

            {helperText ? <p className={styles.HelperText}>{helperText}</p> : null}

            <div className={styles.Footer}>
                <div className={styles.DotList} aria-hidden="true">
                    {steps.map((step, index) => (
                        <span
                            key={step.key}
                            className={styles.ProgressDot}
                            data-active={hasProgress && index <= safeCurrentIndex ? 'true' : 'false'}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RequestStatusCompactProgress;
