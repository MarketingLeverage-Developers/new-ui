import React from 'react';
import Text, { type TextProps } from '../Text/Text';
import styles from './TextDisplay.module.scss';

export type TextDisplayVariant = 'headline' | 'emphasis';

export type TextDisplayProps = Omit<TextProps, 'className' | 'as' | 'size' | 'weight' | 'tone'> & {
    children: React.ReactNode;
    variant?: TextDisplayVariant;
};

const displayClassName: Record<TextDisplayVariant, string> = {
    headline: styles.Headline,
    emphasis: styles.Emphasis,
};

const TextDisplay = ({ children, variant = 'headline', ...props }: TextDisplayProps) => (
    <Text as={variant === 'headline' ? 'h1' : 'p'} className={displayClassName[variant]} {...props}>
        {children}
    </Text>
);

export default TextDisplay;
