import React from 'react';
import SwitchToggle, { type SwitchToggleProps } from './components/SwitchToggle/SwitchToggle';

export type ToggleVariant = 'switch';

export type ToggleProps = ({ variant: 'switch' } & SwitchToggleProps);

const Toggle = (props: ToggleProps) => {
    const { variant, ...rest } = props as ToggleProps;

    if (variant === 'switch') return <SwitchToggle {...(rest as SwitchToggleProps)} />;

    return <SwitchToggle {...(rest as SwitchToggleProps)} />;
};

export default Toggle;
