import { Accordion } from '@/shared/headless/Accordion/Accordion';
import React from 'react';
import styles from './BlurAccordion.module.scss';
import { FaAngleDown } from 'react-icons/fa6';
import type { CSSLength } from '@/shared/types';
import { toCssUnit } from '@/shared/utils';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';

type BlurAccordionProps = {
    children: React.ReactNode;
    value: boolean;
    onValueChange: (v: boolean) => void;
    maxHeight?: CSSLength;
};

const BlurAccordion = ({ children, value, onValueChange, maxHeight }: BlurAccordionProps) => {
    const cssVariables: CSSVariables = {
        '--max-height': toCssUnit(maxHeight),
    };
    return (
        <Accordion value={value} onValueChange={onValueChange}>
            <div className={`${styles.ListWrapper} ${value ? styles.Open : ''}`} style={{ ...cssVariables }}>
                {children}
            </div>

            <div className={styles.Accordion}>
                <Accordion.Button className={styles.Trigger}>
                    {value ? '접기' : '더보기'}
                    <FaAngleDown className={`${styles.Icon} ${value ? styles.Open : ''}`} />
                </Accordion.Button>
            </div>
        </Accordion>
    );
};

export default BlurAccordion;
