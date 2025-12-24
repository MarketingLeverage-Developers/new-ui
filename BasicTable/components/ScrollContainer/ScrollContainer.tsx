import React from 'react';
import styles from './ScrollContainer.module.scss';

type ScrollTableContainerProps = {
    children: React.ReactNode;
    totalTableWidth?: number;
    maxHeight?: string | number;
};

export const ScrollContainer = ({ children, totalTableWidth = 0, maxHeight }: ScrollTableContainerProps) => (
    <div
        className={styles.ScrollContainer}
        style={{
            maxHeight,
            overflowY: maxHeight ? 'auto' : undefined,
        }}
    >
        <div style={{ minWidth: `${totalTableWidth}px` }}>{children}</div>
    </div>
);
