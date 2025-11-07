import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import { toCssUnit } from '@/shared/utils';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import classNames from 'classnames';
import React from 'react';
import styles from './Header.module.scss';
import BaseModalClose from '@/shared/primitives/BaseModalClose/BaseModalClose';
import type { CSSLength } from '@/shared/types';

type HeaderProps = {
    title: React.ReactNode | string;
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    align?: 'stretch' | 'center' | 'start' | 'end' | 'baseline';
    justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    gap?: string | number;
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    padding?: PaddingSize | number;
    margin?: PaddingSize | number;
    marginBottom?: CSSLength;
    fontSize?: CSSLength;
    noBorder?: boolean;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>;

const Header = ({
    title,
    direction,
    align,
    justify = 'space-between',
    gap,
    wrap,
    style,
    className,
    padding = { b: 10 },
    margin,
    marginBottom,
    fontSize = 24,
    noBorder = false,
    ...props
}: HeaderProps) => {
    const cssVariables: CSSVariables = {
        '--flex-direction': direction,
        '--align-items': align,
        '--justify-content': justify,
        '--wrap': wrap,
        '--gap': toCssUnit(gap),
        '--padding': toCssPadding(padding),
        '--margin': toCssPadding(margin),
    };

    const titleCssVariables: CSSVariables = {
        '--margin-bottom': toCssUnit(marginBottom),
        '--font-size': toCssUnit(fontSize),
    };

    const wrapperHeader = classNames(styles.Header, className, {
        [styles.NoBorder]: noBorder,
    });

    return (
        <div {...props} className={wrapperHeader} style={{ ...cssVariables, ...style }}>
            <div className={styles.Title} style={{ ...titleCssVariables }}>
                {typeof title === 'string' ? <span>{title}</span> : title}
            </div>
            <BaseModalClose />
        </div>
    );
};

export default Header;
