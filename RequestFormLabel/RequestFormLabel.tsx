import React from 'react';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import styles from './RequestFormLabel.module.scss';
import classNames from 'classnames';
type Props = {
    direction?: 'row' | 'column';
    children: React.ReactNode;
    gap?: string | number;
    label: string;
    icon: string;
    align?: 'start' | 'end' | 'center';
    labelPaddingTop?: number;
};
const RequestFormLabel = ({
    direction = 'row',
    children,
    gap = 10,
    label,
    icon,
    align = 'center',
    labelPaddingTop = 0,
}: Props) => {
    const className = classNames(styles.LabelWrapper, {
        [styles.Column]: direction === 'column',
    });
    const cssVariables: CSSVariables = {
        '--gap': toCssUnit(gap),
        '--flex-direction': direction,
        '--align-items': align,
        '--padding-top': toCssUnit(labelPaddingTop),
    };
    return (
        <div style={{ ...cssVariables }} className={className}>
            <div className={styles.Label}>
                <img src={icon} alt="" />
                <span>{label}</span>
            </div>
            <div className={styles.Content}>{children}</div>
        </div>
    );
};

export default RequestFormLabel;
