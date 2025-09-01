import React from 'react';
import styles from '../AgreementCheckBox.module.scss';
import CheckBoxToggle from '../../CheckBoxToggle/CheckBoxToggle';

type ItemProps = {
    checked: boolean;
    onChange: (next: boolean) => void;
    label: React.ReactNode;
    modal?: React.ReactNode;
    description?: React.ReactNode;
};

export const Item = ({ checked, label, onChange, description, modal }: ItemProps) => (
    <div className={styles.Item}>
        <div className={styles.Left}>
            <CheckBoxToggle value={checked} onChange={onChange} />
            <div className={styles.LabelBlock}>
                <div className={styles.Label}>{label}</div>
                {description && <div className={styles.Desc}>{description}</div>}
            </div>
        </div>

        <div className={styles.Right}>{modal && modal}</div>
    </div>
);
