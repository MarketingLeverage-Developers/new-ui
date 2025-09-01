import React from 'react';
import styles from './Label.module.scss';

type LabelProps = {
    label: string;
};

export const Label = ({ label }: LabelProps) => <div className={styles.Label}>{label}</div>;
