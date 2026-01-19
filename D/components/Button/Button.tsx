import React, { forwardRef } from 'react';
import BaseButton from './components/BaseButton/BaseButton';
import type { BaseButtonProps } from './components/BaseButton/BaseButton';

import TextButton, { type TextButtonProps } from './components/TextButton/TextButton';

export type ButtonVariant = 'base' | 'text';

export type ButtonProps = ({ variant: 'base' } & BaseButtonProps) | ({ variant: 'text' } & TextButtonProps);

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { variant, ...rest } = props;

    if (variant === 'text') {
        return <TextButton ref={ref} {...rest} />;
    }

    return <BaseButton ref={ref} {...rest} />;
});

Button.displayName = 'Button';

export default Button;
