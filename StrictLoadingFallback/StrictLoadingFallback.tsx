// 기능: StrictOverlay에서 사용하는 기본 로딩 폴백 (화면 중앙 회전 서클)

import React from 'react';
import styles from './StrictLoadingFallback.module.scss';
import Lottie from 'lottie-react';
import loadingAnimation from '@/shared/assets/lotties/strict-loading.json';

const StrictLoadingFallback: React.FC = () => (
    <div className={styles.StrictLoadingFallback}>
        <Lottie animationData={loadingAnimation} loop={true} className={styles.Spinner} />
    </div>
);

export default StrictLoadingFallback;
