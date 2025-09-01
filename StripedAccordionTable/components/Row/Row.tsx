import AccordionTable from '@/shared/headless/AccordionTable/AccordionTable';
import React from 'react';
import styles from './Row.module.scss';

export const Row = (props: React.ComponentProps<typeof AccordionTable.Row>) => (
    <AccordionTable.Row {...props} className={styles.Row} />
);
