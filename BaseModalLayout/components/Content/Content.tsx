import React from 'react';
import styles from './Content.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import { toCssUnit } from '@/shared/utils';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import classNames from 'classnames';

type ContentProps = {
    children: React.ReactNode;
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    align?: 'stretch' | 'center' | 'start' | 'end' | 'baseline';
    justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    gap?: string | number;
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    padding?: PaddingSize | number;
    margin?: PaddingSize | number;
    width?: string | number;
    height?: string | number;
} & React.HTMLAttributes<HTMLDivElement>;

const Content = ({
    children,
    direction = 'column',
    align,
    justify,
    gap,
    wrap,
    width,
    height = 'auto',
    style,
    className,
    padding,
    margin,
    ...props
}: ContentProps) => {
    const cssVariables: CSSVariables = {
        '--flex-direction': direction,
        '--align-items': align,
        '--justify-content': justify,
        '--wrap': wrap,
        '--gap': toCssUnit(gap),
        '--width': toCssUnit(width),
        '--height': toCssUnit(height),
        '--padding': toCssPadding(padding),
        '--margin': toCssPadding(margin),
    };
    return (
        <div {...props} className={classNames(styles.Content, className)} style={{ ...cssVariables, ...style }}>
            {children}
        </div>
    );
};

export default Content;
