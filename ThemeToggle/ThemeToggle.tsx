import Toggle from '@/shared/headless/Toggle/Toggle';
import React from 'react';

import ThemeTrigger from './components/ThemeTrigger';
import Flex from '@/shared/primitives/Flex/Flex';
import Text from '@/shared/primitives/Text/Text';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';

type ThemeToggleProps = Omit<React.ComponentProps<typeof Toggle>, 'children'> & {
    label?: React.ReactNode;
    onTriggerClick?: (value: boolean) => void;
};

const ThemeToggle = ({ label, defaultValue, onChange, value, onTriggerClick }: ThemeToggleProps) => (
    <Toggle defaultValue={defaultValue} onChange={onChange} value={value}>
        <Flex align="center" gap={12}>
            {label && (
                <Text fontSize={13} color={getThemeColor('Gray2')}>
                    {label}
                </Text>
            )}

            <ThemeTrigger onTriggerClick={onTriggerClick} />
        </Flex>
    </Toggle>
);

export default ThemeToggle;
