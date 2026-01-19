import React from 'react';
import classNames from 'classnames';
import styles from './BaseAccordion.module.scss';

import { Accordion as AccordionHeadless } from '@/shared/headless/Accordion/Accordion';

export type BaseAccordionExtraProps = {
    className?: string;
};

export type BaseAccordionProps = React.ComponentProps<typeof AccordionHeadless> & BaseAccordionExtraProps;

const BaseAccordion: React.FC<BaseAccordionProps> = (props) => {
    const { className, children, ...rest } = props;

    const rootClassName = classNames(styles.BaseAccordion, className);

    return (
        <AccordionHeadless {...rest}>
            <div className={rootClassName}>{children}</div>
        </AccordionHeadless>
    );
};

export default BaseAccordion;
