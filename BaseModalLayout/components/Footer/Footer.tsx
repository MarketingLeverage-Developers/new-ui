import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import { toCssUnit } from '@/shared/utils';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import classNames from 'classnames';
import React from 'react';
import styles from './Footer.module.scss';

type FooterProps = {
    children: React.ReactNode;
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    align?: 'stretch' | 'center' | 'start' | 'end' | 'baseline';
    justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    gap?: string | number;
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    padding?: PaddingSize | number;
    margin?: PaddingSize | number;
    noBorder?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const Footer = ({
    children,
    direction,
    align,
    justify = 'end',
    gap,
    wrap,
    style,
    className,
    padding = { t: 10 },
    margin,
    noBorder = false,
    ...props
}: FooterProps) => {
    const cssVariables: CSSVariables = {
        '--flex-direction': direction,
        '--align-items': align,
        '--justify-content': justify,
        '--wrap': wrap,
        '--gap': toCssUnit(gap),
        '--padding': toCssPadding(padding),
        '--margin': toCssPadding(margin),
    };

    const wrapperFooter = classNames(styles.Footer, className, {
        [styles.NoBorder]: noBorder,
    });

    return (
        <div {...props} className={wrapperFooter} style={{ ...cssVariables, ...style }}>
            {children}
        </div>
    );
};
export default Footer;
