import styles from './PageLoadingSpinner.module.scss';

const PageLoadingSpinner = () => (
    <span className={styles.Spinner} role="status" aria-label="페이지를 불러오는 중입니다." />
);

export default PageLoadingSpinner;
