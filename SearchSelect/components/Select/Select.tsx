import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import React, { useMemo } from 'react';
import styles from './Select.module.scss';
import { useSearchSelect } from '../../SearchSelect';
import ManySelect, { useManySelect } from '@/shared/headless/ManySelect/ManySelect';
import CheckBoxToggle from '@/shared/primitives/CheckBoxToggle/CheckBoxToggle';

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
        <Dropdown.Content matchTriggerWidth>
            <div className={styles.SelectWrapper}>
                <div className={styles.Select}>
                    {filtered.length === 0 && <div className={styles.Empty}>결과가 없습니다</div>}
                    {filtered.map((item) => (
                        <ManySelect.Item key={item.value} value={item.value}>
                            <div className={styles.Item} onClick={() => toggleManySelectValue(item.value)}>
                                <CheckBoxToggle value={isChecked(item.value)} />
                                <span>{item.label}</span>
                            </div>
                        </ManySelect.Item>
                    ))}
                </div>
            </div>
        </Dropdown.Content>
    );
};

export default Select;
