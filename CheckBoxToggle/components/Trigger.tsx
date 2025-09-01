import React from 'react';
import styles from './Trigger.module.scss';
import Toggle, { useToggle } from '@/shared/headless/Toggle/Toggle';
import classNames from 'classnames';
import { FaCheck } from 'react-icons/fa';

type TriggerProps = React.ComponentProps<typeof Toggle.Trigger>;

const Trigger = ({ onTriggerClick }: TriggerProps) => {
    const { toggleValue } = useToggle();

    const triggerClassName = classNames(styles.Trigger, {
        [styles.Active]: toggleValue,
    });
    return (
        <Toggle.Trigger className={triggerClassName} onTriggerClick={onTriggerClick}>
            {toggleValue && <FaCheck />}
        </Toggle.Trigger>
    );
};

export default Trigger;
