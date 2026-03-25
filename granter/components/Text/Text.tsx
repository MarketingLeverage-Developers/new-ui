import React from 'react';
import classNames from 'classnames';
import styles from './Text.module.scss';

const TEXT_PRESET_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type PresetTextSize = (typeof TEXT_PRESET_SIZES)[number];

export type TextSize = PresetTextSize | number | string;
export type TextTone = 'inherit' | 'default' | 'muted' | 'subtle' | 'danger' | 'up' | 'down';
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export type TextProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
    as?: React.ElementType;
    size?: TextSize;
    tone?: TextTone;
    weight?: TextWeight;
    children?: React.ReactNode;
};

const isPresetTextSize = (value: TextSize): value is PresetTextSize =>
    typeof value === 'string' && (TEXT_PRESET_SIZES as readonly string[]).includes(value);

const toFontSize = (value: Exclude<TextSize, PresetTextSize>) => (typeof value === 'number' ? `${value}px` : value);

const Text = ({
    as: Component = 'span',
    size = 'md',
    tone = 'default',
    weight = 'regular',
    className,
    children,
    style,
    ...props
}: TextProps) => (
    <Component
        className={classNames(
            styles.Text,
            isPresetTextSize(size) ? styles[`Size-${size}`] : undefined,
            styles[`Tone-${tone}`],
            styles[`Weight-${weight}`],
            className
        )}
        style={isPresetTextSize(size) ? style : { ...style, fontSize: toFontSize(size) }}
        {...props}
    >
        {children}
    </Component>
);

export default Text;
