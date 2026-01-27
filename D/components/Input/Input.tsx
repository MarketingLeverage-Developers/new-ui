import React, { type InputHTMLAttributes } from 'react';
import BaseInput, { type BaseInputExtraProps } from './components/BaseInput/BaseInput';
import RoundedInput, { type RoundedInputProps } from './components/RoundedInput/RoundedInput';
import InnerTextInput, { type InnerTextInputProps } from './components/InnerTextInput/InnerTextInput';
import RoundedPassword, { type RoundedPasswordProps } from './components/RoundedPassword/RoundedPassword';

export type InputVariant = 'base' | 'rounded' | 'inner-text' | 'rounded-password';

export type InputCommonProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'>;

export type InputProps =
    | ({ variant: 'base' } & InputCommonProps & BaseInputExtraProps)
    | ({ variant: 'rounded' } & RoundedInputProps)
    | ({ variant: 'inner-text' } & InnerTextInputProps)
    | ({ variant: 'rounded-password' } & RoundedPasswordProps);

const Input = (props: InputProps) => {
    const { variant, ...rest } = props as any;

    if (variant === 'rounded') return <RoundedInput {...(rest as RoundedInputProps)} />;
    if (variant === 'inner-text') return <InnerTextInput {...(rest as InnerTextInputProps)} />;
    if (variant === 'rounded-password') return <RoundedPassword {...(rest as RoundedPasswordProps)} />;

    return <BaseInput {...(rest as BaseInputExtraProps & InputCommonProps)} />;
};

export default Input;
