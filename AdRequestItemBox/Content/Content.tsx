import React from 'react';
import styles from '../AdRequestItemBox.module.scss';

const Content = ({ children }: { children: React.ReactNode }) => <div className={styles.Content}>{children}</div>;

export default Content;
