import type { ButtonHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import Text from '../Text/Text';
import styles from './MobileOnboardingChoiceCard.module.scss';

export type MobileOnboardingChoiceCardTone = 'accent' | 'cool' | 'warm' | 'neutral';

export type MobileOnboardingChoiceCardProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'title'> & {
    eyebrow?: ReactNode;
    title: ReactNode;
    description?: ReactNode;
    actionLabel?: ReactNode;
    graphic?: ReactNode;
    tone?: MobileOnboardingChoiceCardTone;
    selected?: boolean;
    className?: string;
    visualClassName?: string;
    actionClassName?: string;
};

const MobileOnboardingChoiceCard = ({
    eyebrow,
    title,
    description,
    actionLabel,
    graphic,
    tone = 'accent',
    selected = false,
    className,
    visualClassName,
    actionClassName,
    type = 'button',
    ...buttonProps
}: MobileOnboardingChoiceCardProps) => (
    <button
        type={type}
        className={classNames(styles.Root, className)}
        data-tone={tone}
        data-selected={selected ? 'true' : 'false'}
        data-has-action={actionLabel ? 'true' : 'false'}
        aria-pressed={selected}
        {...buttonProps}
    >
        <div className={classNames(styles.Visual, visualClassName)}>
            <div className={styles.Copy}>
                {eyebrow ? (
                    <Text size="xs" weight="semibold" className={styles.Eyebrow}>
                        {eyebrow}
                    </Text>
                ) : null}

                <Text as="strong" weight="bold" className={styles.Title}>
                    {title}
                </Text>

                {description ? (
                    <Text size="xs" tone="muted" className={styles.Description}>
                        {description}
                    </Text>
                ) : null}
            </div>

            {graphic ? <div className={styles.Graphic}>{graphic}</div> : null}
        </div>

        {actionLabel ? <span className={classNames(styles.Action, actionClassName)}>{actionLabel}</span> : null}
    </button>
);

export default MobileOnboardingChoiceCard;
