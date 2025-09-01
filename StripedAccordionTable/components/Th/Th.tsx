import AccordionTable from '@/shared/headless/AccordionTable/AccordionTable';
import styles from './Th.module.scss';

export const Th = (props: React.ComponentProps<typeof AccordionTable.Th>) => (
    <AccordionTable.Th {...props} className={styles.Th} />
);
