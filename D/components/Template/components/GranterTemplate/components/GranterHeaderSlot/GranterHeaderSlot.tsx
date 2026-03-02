import React from 'react';
import classNames from 'classnames';
import styles from './GranterHeaderSlot.module.scss';

export type GranterHeaderSlotProps = {
    align?: 'left' | 'center' | 'right';
    children?: React.ReactNode;
    className?: string;
};

const GranterHeaderSlot = ({ align = 'right', children, className }: GranterHeaderSlotProps) => (
    <div
        className={classNames(
            styles.Slot,
            {
                [styles.AlignLeft]: align === 'left',
                [styles.AlignCenter]: align === 'center',
                [styles.AlignRight]: align === 'right',
            },
            className
        )}
    >
        {children}
    </div>
);

export default GranterHeaderSlot;
