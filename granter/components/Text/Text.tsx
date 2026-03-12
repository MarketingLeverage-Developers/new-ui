import React from 'react';
import classNames from 'classnames';
import styles from './Text.module.scss';

export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type TextTone = 'inherit' | 'default' | 'muted' | 'subtle' | 'danger' | 'up' | 'down';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export type TextProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
    as?: React.ElementType;
    size?: TextSize;
    tone?: TextTone;
    weight?: TextWeight;
    children?: React.ReactNode;
};

const Text = ({
    as: Component = 'span',
    size = 'md',
    tone = 'default',
    weight = 'regular',
    className,
    children,
    ...props
}: TextProps) => (
    <Component
        className={classNames(styles.Text, styles[`Size-${size}`], styles[`Tone-${tone}`], styles[`Weight-${weight}`], className)}
        {...props}
    >
        {children}
    </Component>
);

export default Text;
