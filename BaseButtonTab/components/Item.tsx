import React from 'react';
import styles from '../BaseButtonTab.module.scss';
import Select from '@/shared/headless/Select/Select';
import { useSelect } from '@/shared/headless/Select/Select';
import classNames from 'classnames';

type ItemProps = {} & React.ComponentProps<typeof Select.Item>;

const Item = ({ ...props }: ItemProps) => {
    const { isActive } = useSelect();
    const itemClassName = classNames(styles.Item, {
        [styles.Active]: isActive(props.value),
    });
    return <Select.Item {...props} className={itemClassName}></Select.Item>;
};

export default Item;
