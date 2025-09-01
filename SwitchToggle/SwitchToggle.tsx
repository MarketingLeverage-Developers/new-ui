import Toggle from '@/shared/headless/Toggle/Toggle';
import React from 'react';

import Trigger from './components/Trigger';

type SwitchToggleProps = Omit<React.ComponentProps<typeof Toggle>, 'children'> & {
    onTriggerClick?: (value: boolean) => void;
};

const SwitchToggle = ({ defaultValue, onChange, value, onTriggerClick }: SwitchToggleProps) => {
    return (
        <Toggle defaultValue={defaultValue} onChange={onChange} value={value}>
            <Trigger onTriggerClick={onTriggerClick} />
        </Toggle>
    );
};

export default SwitchToggle;
