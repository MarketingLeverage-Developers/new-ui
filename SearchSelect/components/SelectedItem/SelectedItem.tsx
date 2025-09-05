import React from 'react';
import styles from './SelectedItem.module.scss';
import RoundedBox from '@/shared/primitives/RoundedBox/RoundedBox';

const SelectedItem = () => (
    <RoundedBox padding={8}>
        <div className={styles.SelectedItem}></div>;
    </RoundedBox>
);

export default SelectedItem;
