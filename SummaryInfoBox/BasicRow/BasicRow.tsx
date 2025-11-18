import React from 'react';
import styles from '../SummaryInfoBox.module.scss';
import userIcon from '@/shared/assets/images/user-icon.svg';
type Props = {
    icon?: string;
    content: string;
};
const BasicRow = ({ icon, content }: Props) => (
    <div className={styles.Row}>
        <img src={icon ?? userIcon} alt="" />
        <span className={styles.textContent}>{content}</span>
    </div>
);

export default BasicRow;
