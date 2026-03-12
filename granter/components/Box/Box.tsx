import React from 'react';
import classNames from 'classnames';
import styles from './Box.module.scss';

export type BoxLength = number | string;

const toCssLength = (value?: BoxLength) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

export type BoxProps = Omit<React.HTMLAttributes<HTMLElement>, 'color'> & {
    as?: React.ElementType;
    flex?: React.CSSProperties['flex'];
    flexGrow?: React.CSSProperties['flexGrow'];
    flexShrink?: React.CSSProperties['flexShrink'];
    flexBasis?: BoxLength;
    width?: BoxLength;
    minWidth?: BoxLength;
    maxWidth?: BoxLength;
    height?: BoxLength;
    minHeight?: BoxLength;
    maxHeight?: BoxLength;
    padding?: BoxLength;
    paddingX?: BoxLength;
    paddingY?: BoxLength;
    paddingTop?: BoxLength;
    paddingRight?: BoxLength;
    paddingBottom?: BoxLength;
    paddingLeft?: BoxLength;
    margin?: BoxLength;
    marginX?: BoxLength;
    marginY?: BoxLength;
    marginTop?: BoxLength;
    marginRight?: BoxLength;
    marginBottom?: BoxLength;
    marginLeft?: BoxLength;
    background?: string;
    border?: string;
    borderColor?: string;
    borderStyle?: React.CSSProperties['borderStyle'];
    borderWidth?: BoxLength;
    borderRadius?: BoxLength;
    overflow?: React.CSSProperties['overflow'];
};

const Box = ({
    as: Component = 'div',
    className,
    style,
    flex,
    flexGrow,
    flexShrink,
    flexBasis,
    width,
    minWidth,
    maxWidth,
    height,
    minHeight,
    maxHeight,
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    margin,
    marginX,
    marginY,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    background,
    border,
    borderColor,
    borderStyle,
    borderWidth,
    borderRadius,
    overflow,
    ...props
}: BoxProps) => {
    const resolvedStyle: React.CSSProperties = {
        flex,
        flexGrow,
        flexShrink,
        flexBasis: toCssLength(flexBasis),
        width: toCssLength(width),
        minWidth: toCssLength(minWidth),
        maxWidth: toCssLength(maxWidth),
        height: toCssLength(height),
        minHeight: toCssLength(minHeight),
        maxHeight: toCssLength(maxHeight),
        padding: toCssLength(padding),
        paddingTop: toCssLength(paddingTop ?? paddingY),
        paddingRight: toCssLength(paddingRight ?? paddingX),
        paddingBottom: toCssLength(paddingBottom ?? paddingY),
        paddingLeft: toCssLength(paddingLeft ?? paddingX),
        margin: toCssLength(margin),
        marginTop: toCssLength(marginTop ?? marginY),
        marginRight: toCssLength(marginRight ?? marginX),
        marginBottom: toCssLength(marginBottom ?? marginY),
        marginLeft: toCssLength(marginLeft ?? marginX),
        background,
        border,
        borderColor,
        borderStyle,
        borderWidth: toCssLength(borderWidth),
        borderRadius: toCssLength(borderRadius),
        overflow,
        ...style,
    };

    return <Component className={classNames(styles.Box, className)} style={resolvedStyle} {...props} />;
};

export default Box;
