import React from 'react';
import classNames from 'classnames';
import styles from './Divider.module.scss';

type DividerVariant = 'base';
type DividerOrientation = 'horizontal' | 'vertical';

export type DividerProps = React.HTMLAttributes<HTMLDivElement> & {
    variant?: DividerVariant;
    orientation?: DividerOrientation;
    color?: string;
    thickness?: number | string;
    length?: number | string;
};

const toCssUnit = (value: number | string | undefined) => {
    if (typeof value === 'number') return `${value}px`;
    return value;
};

const Divider = ({
    variant = 'base',
    orientation = 'horizontal',
    color,
    thickness,
    length,
    className,
    style,
    ...props
}: DividerProps) => {
    const defaultColor = orientation === 'vertical' ? 'var(--Gray5)' : 'var(--Gray6)';
    const defaultThickness = 1;
    const defaultLength = orientation === 'vertical' ? 22 : '100%';

    const dividerWidth = orientation === 'vertical' ? toCssUnit(thickness ?? defaultThickness) : toCssUnit(length ?? defaultLength);
    const dividerHeight =
        orientation === 'vertical' ? toCssUnit(length ?? defaultLength) : toCssUnit(thickness ?? defaultThickness);

    return (
        <div
            {...props}
            role="separator"
            aria-orientation={orientation}
            className={classNames(styles.Divider, variant === 'base' && styles.Divider, className)}
            style={
                {
                    '--divider-width': dividerWidth,
                    '--divider-height': dividerHeight,
                    '--divider-color': color ?? defaultColor,
                    ...style,
                } as React.CSSProperties
            }
        />
    );
};

export default Divider;

