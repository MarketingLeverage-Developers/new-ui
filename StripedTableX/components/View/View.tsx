import Table from '@/shared/headless/TableX/Table';
import styles from './View.module.scss';

export const View = (props: React.ComponentProps<typeof Table.View>) => (
    <Table.View {...props} className={styles.View} />
);
