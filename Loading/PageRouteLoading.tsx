import PageLoadingSpinner from './PageLoadingSpinner';
import styles from './PageRouteLoading.module.scss';

const PageRouteLoading = () => (
    <div className={styles.Region} data-page-route-loading>
        <PageLoadingSpinner />
    </div>
);

export default PageRouteLoading;
