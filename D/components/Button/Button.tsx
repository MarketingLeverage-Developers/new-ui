import React, { forwardRef } from 'react';
import BaseButton from './components/BaseButton/BaseButton';
import type { BaseButtonProps } from './components/BaseButton/BaseButton';

import TextButton, { type TextButtonProps } from './components/TextButton/TextButton';

import BoxButton, { type BoxButtonProps } from './components/BoxButton/BoxButton';

export type ButtonVariant = 'base' | 'text' | 'box';

export type ButtonProps =
    | ({ variant: 'base' } & BaseButtonProps)
    | ({ variant: 'text' } & TextButtonProps)
    | ({ variant: 'box' } & BoxButtonProps);

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { variant, ...rest } = props;

    if (variant === 'text') {
        return <TextButton ref={ref} {...(rest as TextButtonProps)} />;
    }

    if (variant === 'box') {
        return <BoxButton ref={ref} {...(rest as BoxButtonProps)} />;
    }

    return <BaseButton ref={ref} {...(rest as BaseButtonProps)} />;
});

Button.displayName = 'Button';

export default Button;
