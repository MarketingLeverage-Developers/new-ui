import React from 'react';
import styles from './StaticOverlay.module.scss';

type StaticOverlayProps = {
    centerNode?: React.ReactNode;
};

const StaticOverlay: React.FC<StaticOverlayProps> = ({ centerNode = null }) => (
    <div data-overlay-root className={styles.StaticOverlay}>
        <div className={styles.Center}>{centerNode}</div>
    </div>
);

export default StaticOverlay;
