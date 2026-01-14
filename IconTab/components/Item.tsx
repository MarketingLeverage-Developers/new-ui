import classNames from 'classnames';
import React from 'react';
import styles from './Item.module.scss';
import Select, { useSelect } from '@/shared/headless/Select/Select';

type ItemProps = {
    // icon: React.ReactNode;
} & React.ComponentProps<typeof Select.Item>;

const Item = ({ children, ...props }: ItemProps) => {
    const { isActive } = useSelect();

    const iconItemClassName = classNames(styles.Item, {
        [styles.Active]: isActive(props.value),
    });
    return (
        <Select.Item {...props} className={iconItemClassName}>
            {children}
        </Select.Item>
    );
};

export default Item;
