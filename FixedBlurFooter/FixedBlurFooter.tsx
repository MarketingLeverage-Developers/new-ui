import React from 'react';
import styles from './FixedBlurFooter.module.scss';

type FixedBlurFooterProps = {
    children: React.ReactNode;
};

const FixedBlurFooter = ({ children }: FixedBlurFooterProps) => (
    <div className={styles.FixedBlurFooter}>{children}</div>
);

export default FixedBlurFooter;
