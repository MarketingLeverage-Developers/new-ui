import Select from '@/shared/headless/Select/Select';
import { useSelect } from '@/shared/headless/Select/Select';
import classNames from 'classnames';
import styles from './Item.module.scss';
import React from 'react';

type UnderlineTabItemProps = React.ComponentProps<typeof Select.Item>;

export const Item = ({ style, ...props }: UnderlineTabItemProps) => {
    const { isActive } = useSelect();

    const itemClassName = classNames(styles.Item, {
        [styles.Active]: isActive(props.value),
    });

    return (
        <Select.Item {...props} className={itemClassName} style={{ ...style }}>
            {props.children}
        </Select.Item>
    );
};
