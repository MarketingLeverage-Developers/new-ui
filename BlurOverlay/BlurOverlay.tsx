import React from 'react';
import styles from './BlurOverlay.module.scss';

type BlurOverlayProps = {
    amount?: number;
    opacity?: number;
    tint?: string;
    center?: boolean;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
};

const BlurOverlay: React.FC<BlurOverlayProps> = ({
    amount = 8,
    opacity = 0.3,
    tint = '0,0,0',
    center = false,
    className,
    style,
    children,
}) => {
    const cls = [styles.BlurOverlay, center ? styles.Center : '', className ?? ''].filter(Boolean).join(' ');
    return (
        <div
            className={cls}
            style={{
                backdropFilter: `blur(${amount}px)`,
                WebkitBackdropFilter: `blur(${amount}px)`,
                backgroundColor: `rgba(${tint}, ${opacity})`,
                ...style,
            }}
        >
            {children}
        </div>
    );
};

export default BlurOverlay;
