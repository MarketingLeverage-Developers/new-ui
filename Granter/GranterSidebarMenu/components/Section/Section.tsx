import React from 'react';
import styles from '../../GranterSidebarMenu.module.scss';

export type GranterSidebarMenuSectionProps = {
    label?: React.ReactNode;
    children: React.ReactNode;
};

const Section = ({ label, children }: GranterSidebarMenuSectionProps) => (
    <section className={styles.MenuSection}>
        {label ? <p className={styles.SectionLabel}>{label}</p> : null}
        <div className={styles.ItemList}>{children}</div>
    </section>
);

export default Section;
