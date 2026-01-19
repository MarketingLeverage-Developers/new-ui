import React, { type InputHTMLAttributes } from 'react';
import BaseInput, { type BaseInputExtraProps } from './components/BaseInput/BaseInput';

export type InputVariant = 'base';

export type InputCommonProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'>;

export type InputProps = { variant: 'base' } & InputCommonProps & BaseInputExtraProps;

const Input = (props: InputProps) => {
    const { variant, ...rest } = props;

    if (variant === 'base') {
        return <BaseInput {...rest} />;
    }

    return <BaseInput {...rest} />;
};

export default Input;
