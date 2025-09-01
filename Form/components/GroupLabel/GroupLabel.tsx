import React from 'react';
import styles from './GroupLabel.module.scss';

type GroupLabelProps = {
    text: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const GroupLabel = ({ text, ...props }: GroupLabelProps) => (
    <div {...props} className={styles.GroupLabel}>
        <span className={styles.Text}>{text}</span>
        {props.children}
    </div>
);
