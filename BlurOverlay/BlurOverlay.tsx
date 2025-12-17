import React from 'react';
import styles from './BlurOverlay.module.scss';

type BlurOverlayProps = {
    centerNode?: React.ReactNode;
};

const BlurOverlay: React.FC<BlurOverlayProps> = ({ centerNode = null }) => (
    <div data-overlay-root className={styles.BlurOverlay}>
        <div className={styles.Center}>{centerNode}</div>
    </div>
);

export default BlurOverlay;
