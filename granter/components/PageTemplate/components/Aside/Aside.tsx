import React from 'react';
import styles from './Aside.module.scss';

export type AsideProps = {
    children?: React.ReactNode;
};

const Aside = ({ children }: AsideProps) => <aside className={styles.Aside}>{children}</aside>;

export default Aside;
