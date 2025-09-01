import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Grid.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import classNames from 'classnames';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import { Col } from './components';

type Props = {
    padding?: PaddingSize | number;
    children?: ReactNode;
    cols?: number;
    gap?: number;
    rowGap?: number;
    colGap?: number;
} & HTMLAttributes<HTMLDivElement>;

const Grid = ({ children, padding, cols = 12, gap = 12, rowGap, colGap, ...props }: Props) => {
    const cssVariables: CSSVariables = {
        '--padding': toCssPadding(padding),
        '--cols': cols,
        '--gap': `${gap}px`,
        ...(rowGap !== undefined ? { '--row-gap': `${rowGap}px` } : {}),
        ...(colGap !== undefined ? { '--col-gap': `${colGap}px` } : {}),
    };

    const gridClassName = classNames(styles.Grid, props.className);

    return (
        <div {...props} className={gridClassName} style={{ ...cssVariables, ...props.style }}>
            {children}
        </div>
    );
};

export default Grid;

Grid.Col = Col;
