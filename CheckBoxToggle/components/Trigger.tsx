import React from 'react';
import styles from './Trigger.module.scss';
import Toggle, { useToggle } from '@/shared/headless/Toggle/Toggle';
import classNames from 'classnames';
import { FaCheck } from 'react-icons/fa';

type TriggerProps = React.ComponentProps<typeof Toggle.Trigger> & {
    disabled?: boolean;
};

const Trigger = ({ onTriggerClick, disabled }: TriggerProps) => {
    const { toggleValue } = useToggle();

    const triggerClassName = classNames(styles.Trigger, {
        [styles.Active]: toggleValue,
        [styles.Disabled]: disabled,
    });

    const handleClick = (value: boolean) => {
        if (disabled) return;
        onTriggerClick?.(value);
    };

    return (
        <Toggle.Trigger className={triggerClassName} onTriggerClick={handleClick}>
            {toggleValue && <FaCheck />}
        </Toggle.Trigger>
    );
};
export default Trigger;
