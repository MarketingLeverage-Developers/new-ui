import Select from '@/shared/headless/Select/Select';
import { useSelect } from '@/shared/headless/Select/Select';
import classNames from 'classnames';
import styles from '../IconTab.module.scss';
import React from 'react';

export type IconTabItemProps = React.ComponentProps<typeof Select.Item>;

const IconTabItem: React.FC<IconTabItemProps> = ({ style, ...props }) => {
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

export default IconTabItem;
