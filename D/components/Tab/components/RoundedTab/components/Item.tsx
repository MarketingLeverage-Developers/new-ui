import Select from '@/shared/headless/Select/Select';
import { useSelect } from '@/shared/headless/Select/Select';
import classNames from 'classnames';
import styles from '../RoundedTab.module.scss';
import React from 'react';

export type RoundedTabItemProps = React.ComponentProps<typeof Select.Item>;

export const RoundedTabItem: React.FC<RoundedTabItemProps> = ({ style, ...props }) => {
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
