import React from 'react';
import styles from '../DetailsContent.module.scss';
import { GoQuestion } from 'react-icons/go';

// TODO qustion hover 시 나타나는 text props 추가해야함
type IpContentProps = {
    label: string;
    children: React.ReactNode;
};

const IpContent = ({ label, children }: IpContentProps) => (
    <div className={styles.IpContent}>
        <div className={styles.IpContentLabelWrapper}>
            <span className={styles.IpContentLabel}>{label}</span>
            <GoQuestion />
        </div>
        <div className={styles.QuestionIcon}>{children}</div>
    </div>
);

export default IpContent;
