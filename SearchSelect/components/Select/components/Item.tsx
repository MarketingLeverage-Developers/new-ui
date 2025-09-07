import React from 'react';
import ManySelect, { useManySelect } from '@/shared/headless/ManySelect/ManySelect';
import styles from '../Select.module.scss';
import CheckBoxToggle from '@/shared/primitives/CheckBoxToggle/CheckBoxToggle';
import type { SelectItem } from '../../../SearchSelect';

type ItemProps = {
    item: SelectItem;
    isCheck: boolean;
    onTriggerClick: () => void;
};

const Item = ({ item, isCheck, onTriggerClick }: ItemProps) => {
    const { toggleManySelectValue } = useManySelect();

    return (
        <ManySelect.Item value={item.value}>
            <div className={styles.Item} onClick={onTriggerClick}>
                <CheckBoxToggle value={isCheck} />
                <span>{item.label}</span>
            </div>
        </ManySelect.Item>
    );
};

export default Item;
