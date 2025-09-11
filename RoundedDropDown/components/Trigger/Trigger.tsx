import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import React from 'react';
import styles from './Trigger.module.scss';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

type TriggerProps = {
    children: React.ReactNode;
};

export const Trigger = ({ children }: TriggerProps) => (
        <Dropdown.Trigger>
            <div className={styles.Trigger}>
                {children}
                <MdOutlineKeyboardArrowDown className={styles.Arrow} />
            </div>
        </Dropdown.Trigger>
    );
