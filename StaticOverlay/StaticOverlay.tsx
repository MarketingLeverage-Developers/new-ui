// 기능: Main 영역 위에 블러 오버레이와 중앙 컨텐츠를 띄움
import React from 'react';
import styles from './StaticOverlay.module.scss';

type StaticOverlayProps = {
    centerNode?: React.ReactNode;
};

const StaticOverlay: React.FC<StaticOverlayProps> = ({ centerNode = false }) => (
    <div data-overlay-root className={styles.StaticOverlay}>
        <div className={styles.Center}>{centerNode}</div>
    </div>
);

export default StaticOverlay;
