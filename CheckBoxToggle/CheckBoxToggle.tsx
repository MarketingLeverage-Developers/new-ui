import Toggle from '@/shared/headless/Toggle/Toggle';
import React from 'react';
import Trigger from './components/Trigger';

type CheckBoxToggleProps = Omit<React.ComponentProps<typeof Toggle>, 'children'> & {
    onTriggerClick?: (value: boolean) => void;
    disabled?: boolean;
};

const CheckBoxToggle = ({ defaultValue, onChange, value, onTriggerClick, disabled = false }: CheckBoxToggleProps) => (
    <Toggle defaultValue={defaultValue} onChange={onChange} value={value}>
        <Trigger onTriggerClick={onTriggerClick} disabled={disabled} />
    </Toggle>
);

export default CheckBoxToggle;
