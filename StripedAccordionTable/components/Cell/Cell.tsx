import AccordionTable from '@/shared/headless/AccordionTable/AccordionTable';
import React from 'react';
import styles from './Cell.module.scss';

export const Cell = (props: React.ComponentProps<typeof AccordionTable.Cell>) => (
    <AccordionTable.Cell {...props} className={styles.Cell} />
);
