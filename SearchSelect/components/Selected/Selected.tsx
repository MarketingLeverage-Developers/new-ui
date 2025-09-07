import React from 'react';
import styles from './Selected.module.scss';
import { useManySelect } from '@/shared/headless/ManySelect/ManySelect';
import { useSearchSelect } from '../../SearchSelect';
import { MdCancel } from 'react-icons/md';

const Selected = () => {
    const { label } = useSearchSelect();
    const { manySelectValue, toggleManySelectValue } = useManySelect();
    return (
        <div className={styles.Selected}>
            {label && <span className={styles.Label}>선택된 {label}</span>}
            {manySelectValue.map((item, idx) => (
                <div className={styles.Item} key={idx}>
                    <span>{item}</span>
                    <MdCancel style={{ cursor: 'pointer' }} onClick={() => toggleManySelectValue(item)} />
                </div>
            ))}
        </div>
    );
};

export default Selected;
