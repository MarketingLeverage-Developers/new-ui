import { useDropdown } from '@/shared/headless/Dropdown/Dropdown';
import Select from '@/shared/headless/Select/Select';
import React from 'react';
import styles from './Item.module.scss';

type ItemProps = React.ComponentProps<typeof Select.Item>;

const BorderRoundedSelectItem: React.FC<ItemProps> = ({ ...props }) => {
    const { close } = useDropdown();
    const handleClick = () => close();

    return <Select.Item {...props} className={styles.Item} onClick={handleClick} />;
};

export type { ItemProps as BorderRoundedSelectItemProps };
export default BorderRoundedSelectItem;
