import React from 'react';
import classNames from 'classnames';
import styles from './ButtonTabItem.module.scss';
import Select, { useSelect } from '@/shared/headless/Select/Select';

export type ButtonTabItemProps = Omit<React.ComponentProps<typeof Select.Item>, 'value'> & {
    value: string;
    className?: string;
};

const ButtonTabItem: React.FC<ButtonTabItemProps> = (props) => {
    const { className, value, children, ...rest } = props;

    const { isActive } = useSelect();
    const active = isActive(value);

    const itemClassName = classNames(
        styles.Item,
        {
            [styles.Active]: active,
        },
        className
    );

    return (
        <Select.Item value={value} {...rest} className={itemClassName}>
            {children}
        </Select.Item>
    );
};

export default ButtonTabItem;
