import { useDropdown } from '@/shared/headless/Dropdown/Dropdown';
import Select from '@/shared/headless/Select/Select';
import React from 'react';
import styles from './Item.module.scss';

type ItemProps = React.ComponentProps<typeof Select.Item>;

export const Item = ({ ...props }: ItemProps) => {
    const { close } = useDropdown();

    const handleItemClick = () => {
        close();
    };

    return <Select.Item {...props} className={styles.Item} onClick={handleItemClick} />;
};
