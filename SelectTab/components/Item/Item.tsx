import Select from '@/shared/headless/Select/Select';
import { useSelect } from '@/shared/headless/Select/Select';
import classNames from 'classnames';
import React from 'react';
import styles from './Item.module.scss';

type SelectTabItemProps = React.ComponentProps<typeof Select.Item>;
const Item = ({ style, ...props }: SelectTabItemProps) => {
    const { isActive } = useSelect();

    const itemclassName = classNames(styles.Item, {
        [styles.Active]: isActive(props.value),
    });
    return (
        <Select.Item {...props} className={itemclassName} style={{ ...style }}>
            {props.children}
        </Select.Item>
    );
};

export default Item;
