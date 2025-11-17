import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import Select from '@/shared/headless/Select/Select';
import React from 'react';
import styles from './Display.module.scss';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import classNames from 'classnames';

type DisplayProps = React.ComponentProps<typeof Select.Display> & { fullWidth?: boolean };

export const Display = ({ fullWidth = false, ...props }: DisplayProps) => {
    const BorderRoundedSelectDisplayclassName = classNames(styles.Display, {
        [styles.FullWidth]: fullWidth,
    });

    return (
        <Dropdown.Trigger className={BorderRoundedSelectDisplayclassName}>
            <Select.Display {...props} className={styles.Content} />
            <MdOutlineKeyboardArrowDown className={styles.Arrow} />
        </Dropdown.Trigger>
    );
};
