import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import React, { useMemo } from 'react';
import styles from './Select.module.scss';
import Item from './components/Item';
import { useSearchSelect } from '../../SearchSelect';
import { useManySelect } from '@/shared/headless/ManySelect/ManySelect';

const Select = () => {
    const { query, data } = useSearchSelect();
    const { isChecked, toggleManySelectValue } = useManySelect();

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return data.filter((it) => {
            if (q && !it.label.toLowerCase().includes(q)) return false;

            return true;
        });
    }, [data, query, isChecked]);

    return (
        <Dropdown.Content>
            <div className={styles.SelectWrapper}>
                <div className={styles.Select}>
                    {filtered.length === 0 && <div className={styles.Empty}>결과가 없습니다</div>}
                    {filtered.map((item) => (
                        <Item
                            key={item.value}
                            item={item}
                            isCheck={isChecked(item.value)}
                            onTriggerClick={() => toggleManySelectValue(item.value)} // ✅ 여기서 내려줌
                        />
                    ))}
                </div>
            </div>
        </Dropdown.Content>
    );
};

export default Select;
