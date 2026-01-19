import React from 'react';
import classNames from 'classnames';
import styles from './BaseAccordionContent.module.scss';

import { useAccordion } from '@/shared/headless/Accordion/Accordion';

export type BaseAccordionContentProps = React.HTMLAttributes<HTMLDivElement> & {
    className?: string;
};

const BaseAccordionContent: React.FC<BaseAccordionContentProps> = (props) => {
    const { className, children, ...rest } = props;
    const { accordionValue } = useAccordion();

    const rootClassName = classNames(styles.BaseAccordionContent, className);

    if (!accordionValue) return null;

    return (
        <div className={rootClassName} {...rest}>
            {children}
        </div>
    );
};

export default BaseAccordionContent;
