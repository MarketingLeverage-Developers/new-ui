import React from 'react';
import classNames from 'classnames';
import styles from './ChipMultiTabItem.module.scss';

import ManySelect, { useManySelect } from '@/shared/headless/ManySelect/ManySelect';

export type ChipMultiTabItemProps = React.ComponentProps<typeof ManySelect.Item> & {
    className?: string;
};

const ChipMultiTabItem: React.FC<ChipMultiTabItemProps> = (props) => {
    const { value, className, children, onClick, ...rest } = props;

    const { isChecked } = useManySelect();
    const checked = isChecked(value);

    const itemClassName = classNames(
        styles.Item,
        {
            [styles.Active]: checked,
        },
        className
    );
    return (
        <ManySelect.Item value={value} {...rest} className={itemClassName}>
            {children}
        </ManySelect.Item>
    );
};

export default ChipMultiTabItem;
