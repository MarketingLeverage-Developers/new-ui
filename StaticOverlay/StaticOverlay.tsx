// 기능: Main 영역 위에 블러 오버레이와 중앙 컨텐츠를 띄움
import React from 'react';
import styles from './StaticOverlay.module.scss';

type StaticOverlayProps = {
    centerNode?: React.ReactNode;
    zIndex: number;
};

const StaticOverlay: React.FC<StaticOverlayProps> = ({ centerNode = false, zIndex }) => (
    <div data-overlay-root className={styles.StaticOverlay} style={{ zIndex }}>
        <div className={styles.Center}>{centerNode}</div>
    </div>
);

export default StaticOverlay;
