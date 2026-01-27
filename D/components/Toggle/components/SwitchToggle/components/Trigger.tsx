import Toggle, { useToggle } from '@/shared/headless/Toggle/Toggle';
import styles from './Trigger.module.scss';
import React from 'react';
import classNames from 'classnames';

type TriggerProps = React.ComponentProps<typeof Toggle.Trigger>;

const Trigger: React.FC<TriggerProps> = ({ onTriggerClick, ...props }) => {
    const { toggleValue } = useToggle();

    const triggerClassName = classNames(styles.Toggle, {
        [styles.Active]: toggleValue,
    });

    return <Toggle.Trigger className={triggerClassName} onTriggerClick={onTriggerClick} {...props} />;
};

export default Trigger;
