import type { CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './StepProgress.module.scss';

export type StepProgressItem = {
    key: string;
    label: ReactNode;
};

export type StepProgressProps = {
    steps: StepProgressItem[];
    currentIndex: number;
    ariaLabel?: string;
    color?: string;
    className?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const StepProgress = ({
    steps,
    currentIndex,
    ariaLabel = '진행 단계',
    color = '#0ea5e9',
    className,
}: StepProgressProps) => {
    if (steps.length === 0) return null;

    const lastIndex = steps.length - 1;
    const safeCurrentIndex = clamp(currentIndex, 0, lastIndex);
    const progressRatio = lastIndex <= 0 ? 0 : safeCurrentIndex / lastIndex;

    return (
        <div className={classNames(styles.Root, className)}>
            <div
                className={styles.Progress}
                style={
                    {
                        '--step-progress-color': color,
                        '--step-progress-ratio': progressRatio,
                        '--step-progress-count': steps.length,
                        gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
                    } as CSSProperties
                }
                role="progressbar"
                aria-label={ariaLabel}
                aria-valuenow={safeCurrentIndex + 1}
                aria-valuemin={1}
                aria-valuemax={steps.length}
            >
                <span className={styles.Fill} />
                {steps.map((step, index) => (
                    <span
                        key={step.key}
                        className={styles.Step}
                        data-active={index <= safeCurrentIndex ? 'true' : 'false'}
                    >
                        <span className={styles.Dot}>{index + 1}</span>
                        <span className={styles.Label}>{step.label}</span>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default StepProgress;
