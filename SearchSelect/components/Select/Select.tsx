import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import ManySelect from '@/shared/headless/ManySelect/ManySelect';
import React from 'react';
import styles from './Select.module.scss';
import Item from './components/Item';

export type SelectItem = {
    label: string;
    value: string;
};

type SelectProps = {
    items: SelectItem[];
};
// manaySelect 말고 다른 이름으로
const Select = ({ items }: SelectProps) => (
    <Dropdown.Content>
        <div className={styles.Select}>
            <ManySelect defaultValue={['apple']}>
                {items.map((item, idx) => (
                    <Item key={`${item.value}-${idx}`} item={item} isCheck={false} onTriggerClick={() => {}} />
                ))}
            </ManySelect>
        </div>
    </Dropdown.Content>
);

export default Select;
