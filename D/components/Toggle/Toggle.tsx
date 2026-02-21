import React from 'react';
import SwitchToggle, { type SwitchToggleProps } from './components/SwitchToggle/SwitchToggle';
import CheckBoxToggle, { type CheckBoxToggleProps } from './components/CheckBoxToggle/CheckBoxToggle';

export type ToggleVariant = 'switch' | 'checkbox';

export type ToggleProps = ({ variant: 'switch' } & SwitchToggleProps) | ({ variant: 'checkbox' } & CheckBoxToggleProps);

const Toggle = (props: ToggleProps) => {
    const { variant, ...rest } = props as ToggleProps;

    if (variant === 'switch') return <SwitchToggle {...(rest as SwitchToggleProps)} />;
    if (variant === 'checkbox') return <CheckBoxToggle {...(rest as CheckBoxToggleProps)} />;

    return <SwitchToggle {...(rest as SwitchToggleProps)} />;
};

export default Toggle;
