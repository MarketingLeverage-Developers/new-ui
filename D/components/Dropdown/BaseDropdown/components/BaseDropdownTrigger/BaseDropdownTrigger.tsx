import React from 'react';
import classNames from 'classnames';
import Dropdown from '../../../../../../shared/headless/Dropdown/Dropdown';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import styles from './BaseDropdownTrigger.module.scss';

export type BaseDropdownTriggerProps = React.ComponentProps<typeof Dropdown.Trigger> & {
    triggerVariant?: 'base' | 'date-range' | 'rounded';
    onPrev?: () => void;
    onNext?: () => void;
    disabledPrev?: boolean;
    disabledNext?: boolean;
};

const BaseDropdownTrigger: React.FC<BaseDropdownTriggerProps> = ({
    triggerVariant = 'base',
    className,
    disabled,
    onPrev,
    onNext,
    disabledPrev,
    disabledNext,
    children,
    ...props
}) => {
    if (triggerVariant === 'date-range') {
        return (
            <div className={styles.DateRangeWrapper}>
                <button
                    type="button"
                    className={classNames(styles.NavButton, styles.NavPrev)}
                    onClick={onPrev}
                    disabled={disabled || !onPrev || disabledPrev}
                    aria-label="이전 날짜"
                >
                    <MdChevronLeft />
                </button>

                <Dropdown.Trigger
                    {...props}
                    disabled={disabled}
                    className={classNames(styles.DateRangeTrigger, className)}
                >
                    {children}
                </Dropdown.Trigger>

                <button
                    type="button"
                    className={classNames(styles.NavButton, styles.NavNext)}
                    onClick={onNext}
                    disabled={disabled || !onNext || disabledNext}
                    aria-label="다음 날짜"
                >
                    <MdChevronRight />
                </button>
            </div>
        );
    }

    if (triggerVariant === 'rounded') {
        return (
            <Dropdown.Trigger
                {...props}
                disabled={disabled}
                className={classNames(styles.RoundedTrigger, className)}
            >
                {children}
            </Dropdown.Trigger>
        );
    }

    return (
        <Dropdown.Trigger {...props} disabled={disabled} className={className}>
            {children}
        </Dropdown.Trigger>
    );
};

export default BaseDropdownTrigger;
