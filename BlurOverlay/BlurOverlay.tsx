import React from 'react';
import styles from './BlurOverlay.module.scss';

type BlurOverlayProps = {
    centerNode?: React.ReactNode;
    children?: React.ReactNode;
};

const BlurOverlay: React.FC<BlurOverlayProps> = ({ centerNode = false, children }) => (
    <div className={styles.BlurOverlay}>
        {children}
        <div className={styles.OverlayContent}>
            <div className={styles.Center}>{centerNode}</div>
        </div>
    </div>
);

export default BlurOverlay;
