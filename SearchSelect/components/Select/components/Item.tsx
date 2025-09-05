import ManySelect from '@/shared/headless/ManySelect/ManySelect';
import React from 'react';
import type { SelectItem } from '../Select';
import CheckBoxToggle from '@/shared/primitives/CheckBoxToggle/CheckBoxToggle';
import styles from '../Select.module.scss';

type ItemProps = {
    item: SelectItem;
    isCheck: boolean;
    onTriggerClick: (val: boolean) => void;
};

const Item = ({ item, isCheck, onTriggerClick }: ItemProps) => (
    <ManySelect.Item value={'apple'} className="pill">
        <div className={styles.Item} onClick={() => onTriggerClick(!isCheck)}>
            <CheckBoxToggle onTriggerClick={(val) => onTriggerClick(val)} /> <span>{item.label}</span>
        </div>
    </ManySelect.Item>
);

export default Item;
