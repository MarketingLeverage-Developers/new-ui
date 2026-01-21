// CheckBoxDropdown/Trigger/Trigger.tsx
import React from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

import styles from './Trigger.module.scss';

import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import { useCheckBoxDropdownContext } from '../../CheckBoxDropdown';
import Display from '../Display/Display';

type TriggerProps = {
    placeholder: string;
    render?: (value: string[]) => React.ReactNode;
};

const Trigger = ({ placeholder, render }: TriggerProps) => {
    const { disabled } = useCheckBoxDropdownContext();

    return (
        <Dropdown.Trigger className={styles.Trigger} disabled={disabled} aria-disabled={disabled}>
            <Display className={styles.Display} placeholder={placeholder} render={render} />
            <MdKeyboardArrowDown className={styles.Icon} />
        </Dropdown.Trigger>
    );
};

export default Trigger;
