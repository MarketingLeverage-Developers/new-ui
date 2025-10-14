import React from 'react';
import styles from './ScrollerWrapper.module.scss';

type ScrollerWrapperProps = {
    children: React.ReactNode;
};

const ScrollerWrapper = ({ children }: ScrollerWrapperProps) => (
    <div className={styles.ScrollerWrapper}>{children}</div>
);

export default ScrollerWrapper;
