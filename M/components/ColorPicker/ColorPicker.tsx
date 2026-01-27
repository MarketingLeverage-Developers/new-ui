import React, { type InputHTMLAttributes } from 'react';
import BaseColorPicker, { type BaseColorPickerExtraProps } from './components/BaseColorPicker/BaseColorPicker';

export type ColorPickerVariant = 'base';

export type ColorPickerCommonProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'>;

export type ColorPickerProps = { variant: 'base' } & ColorPickerCommonProps & BaseColorPickerExtraProps;

const ColorPicker = (props: ColorPickerProps) => {
    const { variant, ...rest } = props;

    if (variant === 'base') {
        return <BaseColorPicker {...rest} />;
    }

    return <BaseColorPicker {...rest} />;
};

export default ColorPicker;
