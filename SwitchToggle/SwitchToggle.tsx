import Toggle from '@/shared/headless/Toggle/Toggle';
import React from 'react';

import Trigger from './components/Trigger';
import Flex from '../Flex/Flex';
import Text from '../Text/Text';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';

type SwitchToggleProps = Omit<React.ComponentProps<typeof Toggle>, 'children'> & {
    label?: React.ReactNode;
    onTriggerClick?: (value: boolean) => void;
};

const SwitchToggle = ({ label, defaultValue, onChange, value, onTriggerClick }: SwitchToggleProps) => (
    <Toggle defaultValue={defaultValue} onChange={onChange} value={value}>
        <Flex align="center" gap={12}>
            <Text fontSize={13} color={getThemeColor('Gray2')}>
                {label}
            </Text>

            <Trigger onTriggerClick={onTriggerClick} />
        </Flex>
    </Toggle>
);

export default SwitchToggle;
