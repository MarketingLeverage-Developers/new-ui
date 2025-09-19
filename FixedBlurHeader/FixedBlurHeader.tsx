import React from 'react';
import styles from './FixedBlurHeader.module.scss';

type FixedBlurHeaderProps = {
    children: React.ReactNode;
};

const FixedBlurHeader = ({ children }: FixedBlurHeaderProps) => (
    <div className={styles.FixedBlurHeader}>{children}</div>
);

export default FixedBlurHeader;
