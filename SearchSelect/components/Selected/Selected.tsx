import React from 'react';
import styles from './Selected.module.scss';
import { useManySelect } from '@/shared/headless/ManySelect/ManySelect';
import Item from './components/Item';
import { useSearchSelect } from '../../SearchSelect';

const Selected = () => {
    const { label } = useSearchSelect();
    const { manySelectValue, toggleManySelectValue } = useManySelect();
    return (
        <div className={styles.Selected}>
            {label && <span className={styles.Label}>선택된 {label}</span>}
            {manySelectValue.map((item, idx) => (
                <Item key={idx} text={item} onCancel={() => toggleManySelectValue(item)} />
            ))}
        </div>
    );
};

export default Selected;
