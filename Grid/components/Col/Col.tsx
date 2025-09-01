import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Col.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import classNames from 'classnames';

type ColProps = {
    children?: ReactNode;
    span?: number;
    start?: number;
    align?: 'left' | 'center' | 'right' | 'start' | 'end' | 'stretch';
} & HTMLAttributes<HTMLDivElement>;

export const Col = ({ children, span = 12, start, align, ...props }: ColProps) => {
    const cssVariables: CSSVariables = {
        '--span': span,
        '--justify-self':
            align === 'right' || align === 'end'
                ? 'end'
                : align === 'center'
                ? 'center'
                : align === 'stretch'
                ? 'stretch'
                : 'start',
        ...(start ? { gridColumnStart: String(start) } : {}),
    };

    const colClassName = classNames(styles.Col, props.className);

    return (
        <div {...props} className={colClassName} style={{ ...cssVariables, ...props.style }}>
            {children}
        </div>
    );
};
