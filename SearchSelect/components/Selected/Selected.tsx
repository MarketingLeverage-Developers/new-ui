import React from 'react';
import styles from './Selected.module.scss';
import RoundedBox from '@/shared/primitives/RoundedBox/RoundedBox';
import { useManySelect } from '@/shared/headless/ManySelect/ManySelect';

const Selected = () => {
    const { manySelectValue } = useManySelect();
    return (
        <RoundedBox padding={8}>
            <div className={styles.Selected}>
                {manySelectValue.map((item, idx) => (
                    <span key={idx}>{item}</span>
                ))}
            </div>
        </RoundedBox>
    );
};

export default Selected;
