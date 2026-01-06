import Table from '@/shared/headless/TableX/Table';
import styles from './Th.module.scss';

export const Th = (props: React.ComponentProps<typeof Table.Th>) => <Table.Th {...props} className={styles.Th} />;
