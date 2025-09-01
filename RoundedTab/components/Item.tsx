import Select from '@/shared/headless/Select/Select';
import { useSelect } from '@/shared/headless/Select/Select';
import classNames from 'classnames';
import styles from './Item.module.scss';
import React from 'react';

type RoundedTabItemProps = React.ComponentProps<typeof Select.Item>;

export const Item = ({ style, ...props }: RoundedTabItemProps) => {
    const { isActive, selectValue } = useSelect();

    const itemclassName = classNames(styles.Item, {
        [styles.Active]: isActive(props.value),
    });

    console.log('밸류', selectValue, props.value);

    return (
        <Select.Item {...props} className={itemclassName} style={{ ...style }}>
            {props.children}
        </Select.Item>
    );
};
