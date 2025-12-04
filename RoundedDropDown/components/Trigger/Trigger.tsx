import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import React from 'react';
import styles from './Trigger.module.scss';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

type TriggerProps = {
    children: React.ReactNode;
} & React.ComponentProps<typeof Dropdown.Trigger>;

export const Trigger = ({ children, ...props }: TriggerProps) => (
    <Dropdown.Trigger {...props}>
        <div className={styles.Trigger}>
            {children}
            <MdOutlineKeyboardArrowDown className={styles.Arrow} />
        </div>
    </Dropdown.Trigger>
);
