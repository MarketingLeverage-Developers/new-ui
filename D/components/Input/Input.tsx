import React, { type InputHTMLAttributes } from 'react';
import BaseInput, { type BaseInputExtraProps } from './components/BaseInput/BaseInput';
import RoundedInput, { type RoundedInputProps } from './components/RoundedInput/RoundedInput';
import InnerTextInput, { type InnerTextInputProps } from './components/InnerTextInput/InnerTextInput';
import RoundedPassword, { type RoundedPasswordProps } from './components/RoundedPassword/RoundedPassword';
import SearchInput, { type SearchInputProps } from './components/SearchInput/SearchInput';
import BaseMultiInput, { type BaseMultiInputExtraProps } from '../MultiInput/components/BaseMultiInput/BaseMultiInput';
import type { MultiInputCommonProps } from '../MultiInput/MultiInput';

export type InputVariant =
    | 'base'
    | 'granter-primary'
    | 'rounded'
    | 'inner-text'
    | 'rounded-password'
    | 'search'
    | 'rounded-search'
    | 'multi';

export type InputCommonProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'>;

export type InputProps =
    | ({ variant: 'base' } & InputCommonProps & BaseInputExtraProps)
    | ({ variant: 'granter-primary' } & InputCommonProps & BaseInputExtraProps)
    | ({ variant: 'rounded' } & RoundedInputProps)
    | ({ variant: 'inner-text' } & InnerTextInputProps)
    | ({ variant: 'rounded-password' } & RoundedPasswordProps)
    | ({ variant: 'search' } & SearchInputProps)
    | ({ variant: 'rounded-search' } & SearchInputProps)
    | ({ variant: 'multi' } & MultiInputCommonProps & BaseMultiInputExtraProps);

const Input = (props: InputProps) => {
    if (props.variant === 'multi') {
        const { variant: _variant, ...rest } = props;
        return <BaseMultiInput {...(rest as MultiInputCommonProps & BaseMultiInputExtraProps)} />;
    }

    if (props.variant === 'granter-primary') {
        const { variant: _variant, ...rest } = props;
        return <BaseInput {...(rest as BaseInputExtraProps & InputCommonProps)} styleVariant="granter" />;
    }

    if (props.variant === 'rounded') {
        const { variant: _variant, ...rest } = props;
        return <RoundedInput {...(rest as RoundedInputProps)} />;
    }

    if (props.variant === 'inner-text') {
        const { variant: _variant, ...rest } = props;
        return <InnerTextInput {...(rest as InnerTextInputProps)} />;
    }

    if (props.variant === 'rounded-password') {
        const { variant: _variant, ...rest } = props;
        return <RoundedPassword {...(rest as RoundedPasswordProps)} />;
    }

    if (props.variant === 'search' || props.variant === 'rounded-search') {
        const { variant: _variant, ...rest } = props;
        return <SearchInput {...(rest as SearchInputProps)} />;
    }

    const { variant: _variant, ...rest } = props;
    return <BaseInput {...(rest as BaseInputExtraProps & InputCommonProps)} />;
};

export default Input;
