import React from 'react';
import classNames from 'classnames';
import { FaCheck } from 'react-icons/fa';
import Toggle, { useToggle } from '../../../../../../shared/headless/Toggle/Toggle';
import styles from './Trigger.module.scss';

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
            {toggleValue ? <FaCheck /> : null}
        </Toggle.Trigger>
    );
};

export default Trigger;
