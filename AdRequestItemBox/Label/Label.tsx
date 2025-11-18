import React from 'react';
import styles from '../AdRequestItemBox.module.scss';

type Props = {
    label: string;
    icon: string;
    children: React.ReactNode;
    rightNode?: React.ReactNode;
};
const Label = ({ label, icon, children, rightNode }: Props) => (
    <div className={styles.LabelWrapper}>
        <div className={styles.Label}>
            <div className={styles.Title}>
                <img src={icon} alt="" />
                <span>{label}</span>
            </div>
            {rightNode && rightNode}
        </div>
        {children}
    </div>
);

export default Label;
