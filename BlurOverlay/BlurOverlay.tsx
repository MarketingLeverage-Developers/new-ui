// 기능: Main 영역 위에 블러 오버레이와 중앙 컨텐츠를 띄움
import React from 'react';
import styles from './BlurOverlay.module.scss';

type BlurOverlayProps = {
    centerNode?: React.ReactNode;
};

const BlurOverlay: React.FC<BlurOverlayProps> = ({ centerNode = false }) => (
    <div data-overlay-root className={styles.BlurOverlay}>
        <div className={styles.Center}>{centerNode}</div>
    </div>
);

export default BlurOverlay;
