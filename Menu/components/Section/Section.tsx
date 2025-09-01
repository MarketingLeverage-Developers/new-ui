import React from 'react';
import styles from './Section.module.scss';

type SectionProps = {
    children: React.ReactNode;
};

export const Section = ({ children }: SectionProps) => <div className={styles.Section}>{children}</div>;
