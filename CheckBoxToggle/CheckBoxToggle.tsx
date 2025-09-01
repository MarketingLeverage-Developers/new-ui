import Toggle from '@/shared/headless/Toggle/Toggle';
import React from 'react';
import Trigger from './components/Trigger';

type CheckBoxToggleProps = Omit<React.ComponentProps<typeof Toggle>, 'children'> & {
    onTriggerClick?: (value: boolean) => void;
};

const CheckBoxToggle = ({ defaultValue, onChange, value, onTriggerClick }: CheckBoxToggleProps) => (
    <Toggle defaultValue={defaultValue} onChange={onChange} value={value}>
        <Trigger onTriggerClick={onTriggerClick} />
    </Toggle>
);

export default CheckBoxToggle;
