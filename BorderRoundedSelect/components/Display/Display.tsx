import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import Select from '@/shared/headless/Select/Select';
import React from 'react';
import styles from './Display.module.scss';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';

type DisplayProps = React.ComponentProps<typeof Select.Display> & {};

export const Display = ({ ...props }: DisplayProps) => (
    <Dropdown.Trigger className={styles.Display}>
        <Select.Display {...props} className={styles.Content} />
        <MdOutlineKeyboardArrowDown className={styles.Arrow} />
    </Dropdown.Trigger>
);
