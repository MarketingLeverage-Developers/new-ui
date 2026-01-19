import React, { forwardRef } from 'react';
import classNames from 'classnames';
import styles from './BaseAccordionHeader.module.scss';
import { MdKeyboardArrowDown } from 'react-icons/md';

import { useAccordion } from '@/shared/headless/Accordion/Accordion';

export type BaseAccordionHeaderProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    title?: string;
    right?: React.ReactNode;
};

const BaseAccordionHeader = forwardRef<HTMLButtonElement, BaseAccordionHeaderProps>((props, ref) => {
    const { className, title, children, right, type = 'button', onClick, ...rest } = props;

    const { accordionValue, toggleAccordion } = useAccordion();

    const rootClassName = classNames(styles.BaseAccordionHeader, className);

    const leftContent = children ?? title;

    return (
        <button
            ref={ref}
            type={type}
            className={rootClassName}
            aria-expanded={accordionValue}
            onClick={(e) => {
                onClick?.(e);
                if (e.defaultPrevented) return;
                toggleAccordion();
            }}
            {...rest}
        >
            <div className={styles.Left}>{leftContent}</div>

            <div className={styles.Right}>
                {right ? <div className={styles.RightSlot}>{right}</div> : null}
                <MdKeyboardArrowDown
                    className={classNames(styles.Chevron, { [styles.Open]: accordionValue })}
                    aria-hidden
                />
            </div>
        </button>
    );
});

BaseAccordionHeader.displayName = 'BaseAccordionHeader';

export default BaseAccordionHeader;
