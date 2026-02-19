import Pagination from '../../../../../shared/headless/Pagination/Pagination';
import styles from './ArrowPagination.module.scss';

export type ArrowPaginationProps = {
    total: number;
    page: number;
    size: number;
    onChange: (page: number) => void;
};

const ArrowPagination = ({ total, page, size, onChange }: ArrowPaginationProps) => {
    const handleChange = (next: { page: number; size: number; total: number }) => {
        onChange(next.page);
    };

    return (
        <Pagination value={{ page, size, total }} onChange={handleChange}>
            <div className={styles.ArrowPagination}>
                <Pagination.FastPrev className={styles.PagingButton}>«</Pagination.FastPrev>
                <Pagination.Prev className={styles.PagingButton}>‹</Pagination.Prev>
                <Pagination.Pages className={styles.PagingButton} activeClassName={styles.Active} />
                <Pagination.Next className={styles.PagingButton}>›</Pagination.Next>
                <Pagination.FastNext className={styles.PagingButton}>»</Pagination.FastNext>
            </div>
        </Pagination>
    );
};

export default ArrowPagination;
