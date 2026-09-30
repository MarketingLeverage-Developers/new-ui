import styles from './InitialLoadingScreen.module.scss';

const InitialLoadingScreen = () => (
    <div className={styles.Screen} data-app-initial-loading role="status" aria-label="인트라넷을 불러오는 중입니다.">
        <img src="/loading-brand-gray.svg" width={64} height={64} alt="" />
    </div>
);

export default InitialLoadingScreen;
