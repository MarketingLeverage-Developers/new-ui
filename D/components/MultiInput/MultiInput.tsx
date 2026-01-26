import React, { type InputHTMLAttributes } from 'react';
import BaseMultiInput, { type BaseMultiInputExtraProps } from './components/BaseMultiInput/BaseMultiInput';

export type MultiInputVariant = 'base';
export type MultiInputCommonProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange' | 'prefix' | 'suffix'
>;

export type MultiInputProps =
    | ({ variant: 'base' } & MultiInputCommonProps & BaseMultiInputExtraProps)
    | ({ variant: MultiInputVariant } & MultiInputCommonProps & BaseMultiInputExtraProps);

const MultiInput = (props: MultiInputProps) => {
    const { variant, ...rest } = props;

    if (variant === 'base') {
        return <BaseMultiInput {...rest} />;
    }

    return <BaseMultiInput {...rest} />;
};

export default MultiInput;
