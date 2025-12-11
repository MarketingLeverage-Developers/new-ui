import Toggle, { useToggle } from '@/shared/headless/Toggle/Toggle';
import styles from './ThemeTrigger.module.scss';
import React from 'react';
import classNames from 'classnames';
import { FiSun, FiMoon } from 'react-icons/fi';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';

type TriggerProps = React.ComponentProps<typeof Toggle.Trigger>;

const ThemeTrigger = ({ onTriggerClick }: TriggerProps) => {
    const { toggleValue } = useToggle();

    const triggerClassName = classNames(styles.Toggle, {
        [styles.Active]: toggleValue,
    });

    return (
        <Toggle.Trigger className={triggerClassName} onTriggerClick={onTriggerClick}>
            <div className={styles.Knob}>
                {toggleValue ? (
                    // Dark Mode -> Moon Icon
                    <FiMoon color={getThemeColor('Primary1')} />
                ) : (
                    // Light Mode -> Sun Icon
                    <FiSun color={getThemeColor('Gray5')} />
                )}
            </div>
        </Toggle.Trigger>
    );
};

export default ThemeTrigger;
