import React from 'react';
import classNames from 'classnames';
import styles from './Box.module.scss';

export type BoxLength = number | string;

const toCssLength = (value?: BoxLength) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

const assignIfDefined = (
    target: React.CSSProperties,
    key: keyof React.CSSProperties,
    value: React.CSSProperties[keyof React.CSSProperties]
) => {
    if (value !== undefined) {
        target[key] = value;
    }
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
        ...style,
    };

    assignIfDefined(resolvedStyle, 'flex', flex);
    assignIfDefined(resolvedStyle, 'flexGrow', flexGrow);
    assignIfDefined(resolvedStyle, 'flexShrink', flexShrink);
    assignIfDefined(resolvedStyle, 'flexBasis', toCssLength(flexBasis));
    assignIfDefined(resolvedStyle, 'width', toCssLength(width));
    assignIfDefined(resolvedStyle, 'minWidth', toCssLength(minWidth));
    assignIfDefined(resolvedStyle, 'maxWidth', toCssLength(maxWidth));
    assignIfDefined(resolvedStyle, 'height', toCssLength(height));
    assignIfDefined(resolvedStyle, 'minHeight', toCssLength(minHeight));
    assignIfDefined(resolvedStyle, 'maxHeight', toCssLength(maxHeight));
    assignIfDefined(resolvedStyle, 'padding', toCssLength(padding));
    assignIfDefined(resolvedStyle, 'paddingTop', toCssLength(paddingTop ?? paddingY));
    assignIfDefined(resolvedStyle, 'paddingRight', toCssLength(paddingRight ?? paddingX));
    assignIfDefined(resolvedStyle, 'paddingBottom', toCssLength(paddingBottom ?? paddingY));
    assignIfDefined(resolvedStyle, 'paddingLeft', toCssLength(paddingLeft ?? paddingX));
    assignIfDefined(resolvedStyle, 'margin', toCssLength(margin));
    assignIfDefined(resolvedStyle, 'marginTop', toCssLength(marginTop ?? marginY));
    assignIfDefined(resolvedStyle, 'marginRight', toCssLength(marginRight ?? marginX));
    assignIfDefined(resolvedStyle, 'marginBottom', toCssLength(marginBottom ?? marginY));
    assignIfDefined(resolvedStyle, 'marginLeft', toCssLength(marginLeft ?? marginX));
    assignIfDefined(resolvedStyle, 'background', background);
    assignIfDefined(resolvedStyle, 'border', border);
    assignIfDefined(resolvedStyle, 'borderColor', borderColor);
    assignIfDefined(resolvedStyle, 'borderStyle', borderStyle);
    assignIfDefined(resolvedStyle, 'borderWidth', toCssLength(borderWidth));
    assignIfDefined(resolvedStyle, 'borderRadius', toCssLength(borderRadius));
    assignIfDefined(resolvedStyle, 'overflow', overflow);

    return <Component className={classNames(styles.Box, className)} style={resolvedStyle} {...props} />;
};

export default Box;
