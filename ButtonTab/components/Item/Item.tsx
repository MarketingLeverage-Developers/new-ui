import Select, { useSelect } from '@/shared/headless/Select/Select';
import React from 'react';
import styles from './Item.module.scss';
import classNames from 'classnames';

type ItemProps = {} & React.ComponentProps<typeof Select.Item>;

export const Item = ({ ...props }: ItemProps) => {
    const { isActive } = useSelect();
    const itemClassName = classNames(styles.Item, {
        [styles.Active]: isActive(props.value),
    });

    return <Select.Item {...props} className={itemClassName}></Select.Item>;
};
