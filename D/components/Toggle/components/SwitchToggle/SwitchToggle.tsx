import Toggle from '@/shared/headless/Toggle/Toggle';
import React from 'react';

import Trigger from './components/Trigger';
import Text from '../../../Text/Text';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import Box from '../../../Box/Box';

export type SwitchToggleProps = Omit<React.ComponentProps<typeof Toggle>, 'children'> & {
    label?: React.ReactNode;
    onTriggerClick?: (value: boolean) => void;
};

const SwitchToggle: React.FC<SwitchToggleProps> = ({ label, defaultValue, onChange, value, onTriggerClick }) => (
    <Toggle defaultValue={defaultValue} onChange={onChange} value={value}>
        <Box align="center" gap={12}>
            <Text fontSize={13} textColor={getThemeColor('Gray2')}>
                {label}
            </Text>

            <Trigger onTriggerClick={onTriggerClick} />
        </Box>
    </Toggle>
);

export default SwitchToggle;
