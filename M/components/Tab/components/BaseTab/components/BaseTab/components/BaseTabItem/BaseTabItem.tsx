import React from 'react';
import classNames from 'classnames';
import styles from './BaseTabItem.module.scss';
import Select, { useSelect } from '@/shared/headless/Select/Select';

export type BaseTabItemTone = 'default' | 'add';

export type BaseTabItemProps = React.ComponentProps<typeof Select.Item> & {
    tone?: BaseTabItemTone;
    className?: string;
};

const BaseTabItem: React.FC<BaseTabItemProps> = (props) => {
    const { className, value, tone = 'default', children, onClick, ...rest } = props;

    const { isActive } = useSelect();
    const active = tone === 'default' ? isActive(value) : false;

    const itemClassName = classNames(
        styles.Item,
        {
            [styles.Active]: active,
            [styles.Add]: tone === 'add',
        },
        className
    );

    if (tone === 'add') {
        const handleAddClick: React.MouseEventHandler<HTMLButtonElement> = () => {
            onClick?.(value);
        };

        return (
            <button type="button" className={itemClassName} onClick={handleAddClick}>
                {children}
            </button>
        );
    }

    return (
        <Select.Item value={value} {...rest} className={itemClassName} onClick={onClick}>
            {children}
        </Select.Item>
    );
};

export default BaseTabItem;
