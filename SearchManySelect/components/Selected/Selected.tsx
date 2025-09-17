import React, { useMemo } from 'react';
import styles from './Selected.module.scss';
import { useManySelect } from '@/shared/headless/ManySelect/ManySelect';
import { MdCancel } from 'react-icons/md';
import { useQuerySearch } from '@/shared/headless/QuerySearch/QuerySearch';
import type { SelectItem } from '../../SearchManySelect';

const Selected = () => {
    const { label, data } = useQuerySearch<SelectItem>();
    const { manySelectValue, toggleManySelectValue } = useManySelect();

    const labelMap = useMemo(() => {
        const map = new Map<string, string>();
        data.forEach((i: any) => map.set(i.uid, i.label));
        return map;
    }, [data]);

    return (
        <div className={styles.Selected}>
            {label && <span className={styles.Label}>선택된 {label}</span>}
            {manySelectValue.map((item, idx) => (
                <div className={styles.Item} key={idx}>
                    <span>{labelMap.get(item)}</span>
                    <MdCancel style={{ cursor: 'pointer' }} onClick={() => toggleManySelectValue(item)} />
                </div>
            ))}
        </div>
    );
};

export default Selected;
