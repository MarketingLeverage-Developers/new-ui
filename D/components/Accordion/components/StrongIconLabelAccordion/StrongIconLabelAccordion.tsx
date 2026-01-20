import React, { useMemo } from 'react';
import classNames from 'classnames';
import { MdKeyboardArrowDown } from 'react-icons/md';

import { Accordion as AccordionHeadless } from '@/shared/headless/Accordion/Accordion';

import styles from './StrongIconLabelAccordion.module.scss';

export type StrongIconLabelAccordionProps = {
    icon?: React.ReactNode;
    text: React.ReactNode;

    direction?: 'row' | 'column';
    gap?: number;

    defaultValue?: boolean;

    value?: boolean;
    onValueChange?: (next: boolean) => void;

    children: React.ReactNode;

    className?: string;

    transitionMs?: number;
    unmountOnClose?: boolean;
};

const StrongIconLabelAccordion: React.FC<StrongIconLabelAccordionProps> = (props) => {
    const {
        icon,
        text,
        direction = 'row',
        gap = 12,

        defaultValue,
        value,
        onValueChange,

        children,
        className,

        transitionMs = 200,
        unmountOnClose = false,
    } = props;

    const cssVars = useMemo<React.CSSProperties>(
        () => ({
            ['--label-gap' as any]: `${gap}px`,
        }),
        [gap]
    );

    return (
        <AccordionHeadless value={value} defaultValue={defaultValue} onValueChange={onValueChange}>
            <AccordionHeadless.Box className={classNames(styles.Root, className)} style={cssVars}>
                <AccordionHeadless.Button className={styles.HeaderButton}>
                    <div
                        className={classNames(styles.HeaderInner, {
                            [styles.Row]: direction === 'row',
                            [styles.Column]: direction === 'column',
                        })}
                    >
                        <div className={styles.Left}>
                            {icon ? <span className={styles.Icon}>{icon}</span> : null}
                            <span className={styles.Text}>{text}</span>
                        </div>

                        <MdKeyboardArrowDown className={styles.Chevron} />
                    </div>
                </AccordionHeadless.Button>

                <AccordionHeadless.Hidden
                    className={styles.Content}
                    transitionMs={transitionMs}
                    unmountOnClose={unmountOnClose}
                >
                    {children}
                </AccordionHeadless.Hidden>
            </AccordionHeadless.Box>
        </AccordionHeadless>
    );
};

export default StrongIconLabelAccordion;
