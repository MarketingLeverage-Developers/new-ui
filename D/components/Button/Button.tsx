import React, { forwardRef } from 'react';
import BaseButton from './components/BaseButton/BaseButton';
import type { BaseButtonProps } from './components/BaseButton/BaseButton';

import TextButton, { type TextButtonProps } from './components/TextButton/TextButton';

import BoxButton, { type BoxButtonProps } from './components/BoxButton/BoxButton';
import HoverButton, { type HoverButtonProps } from './components/HoverButton/HoverButton';

export type ButtonVariant = 'base' | 'text' | 'box' | 'hover';

export type ButtonProps =
    | ({ variant: 'base' } & BaseButtonProps)
    | ({ variant: 'text' } & TextButtonProps)
    | ({ variant: 'box' } & BoxButtonProps)
    | ({ variant: 'hover' } & HoverButtonProps);

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { variant, ...rest } = props;

    if (variant === 'text') {
        return <TextButton ref={ref} {...(rest as TextButtonProps)} />;
    }

    if (variant === 'box') {
        return <BoxButton ref={ref} {...(rest as BoxButtonProps)} />;
    }

    if (variant === 'hover') {
        return <HoverButton ref={ref} {...(rest as HoverButtonProps)} />;
    }

    return <BaseButton ref={ref} {...(rest as BaseButtonProps)} />;
});

Button.displayName = 'Button';

export default Button;
