// CheckBoxDropdown/Item/Item.tsx
import React from 'react';
import classNames from 'classnames';
import { FaCheck } from 'react-icons/fa6';

import styles from './Item.module.scss';
import { useManySelect, type ManySelectValue } from '@/shared/headless/ManySelect/ManySelect';

type ItemProps = React.HTMLAttributes<HTMLDivElement> & {
    text: string;
    value: string;
    onItemClick?: (next: ManySelectValue) => void;
};

const Item = ({ text, value, onItemClick, className, ...props }: ItemProps) => {
    const { isChecked, toggleManySelectValue } = useManySelect();
    const active = isChecked(value);

    const handleClick = () => {
        const next = toggleManySelectValue(value);
        onItemClick?.(next);
    };

    return (
        <div
            {...props}
            role="option"
            aria-selected={active}
            className={classNames(styles.Item, className, { [styles.Active]: active })}
            onClick={handleClick}
        >
            <div className={classNames(styles.Checkbox, { [styles.Checked]: active })}>
                <FaCheck className={styles.CheckIcon} />
            </div>

            <div className={classNames(styles.Text, { [styles.CheckedText]: active })}>{text}</div>
        </div>
    );
};

export default Item;
