import React from 'react';
import classNames from 'classnames';
import Box, { type BoxLength, type BoxProps } from '../Box/Box';
import styles from './Grid.module.scss';

type GridCssVariables = React.CSSProperties & {
    '--granter-grid-columns'?: string;
    '--granter-grid-columns-tablet'?: string;
    '--granter-grid-columns-mobile'?: string;
    '--granter-grid-template-columns'?: React.CSSProperties['gridTemplateColumns'];
    '--granter-grid-template-columns-tablet'?: React.CSSProperties['gridTemplateColumns'];
    '--granter-grid-template-columns-mobile'?: React.CSSProperties['gridTemplateColumns'];
    '--granter-grid-gap'?: string;
};

const toCssLength = (value?: BoxLength) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

export type GridProps = BoxProps & {
    columns?: number;
    columnsTablet?: number;
    columnsMobile?: number;
    templateColumns?: React.CSSProperties['gridTemplateColumns'];
    templateColumnsTablet?: React.CSSProperties['gridTemplateColumns'];
    templateColumnsMobile?: React.CSSProperties['gridTemplateColumns'];
    alignItems?: React.CSSProperties['alignItems'];
    justifyItems?: React.CSSProperties['justifyItems'];
    gap?: BoxLength;
};

const Grid = ({
    className,
    style,
    columns = 1,
    columnsTablet,
    columnsMobile,
    templateColumns,
    templateColumnsTablet,
    templateColumnsMobile,
    alignItems,
    justifyItems,
    gap = 0,
    ...props
}: GridProps) => {
    const gridCssVariables: GridCssVariables = {
        '--granter-grid-columns': String(columns),
        '--granter-grid-columns-tablet': columnsTablet !== undefined ? String(columnsTablet) : undefined,
        '--granter-grid-columns-mobile': columnsMobile !== undefined ? String(columnsMobile) : undefined,
        '--granter-grid-template-columns': templateColumns,
        '--granter-grid-template-columns-tablet': templateColumnsTablet,
        '--granter-grid-template-columns-mobile': templateColumnsMobile,
        '--granter-grid-gap': toCssLength(gap),
    };

    return (
        <Box
            className={classNames(styles.Grid, className)}
            style={{ alignItems, justifyItems, ...gridCssVariables, ...style }}
            {...props}
        />
    );
};

export default Grid;
