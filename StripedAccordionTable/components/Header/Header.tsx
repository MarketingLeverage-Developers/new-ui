import AccordionTable from '@/shared/headless/AccordionTable/AccordionTable';
import React from 'react';
import styles from './Header.module.scss';

export const Header = (props: React.ComponentProps<typeof AccordionTable.Header>) => (
    <AccordionTable.Header {...props} className={styles.Header} />
);
