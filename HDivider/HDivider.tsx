import React from 'react';
import styles from './HDivider.module.scss';

type HDividerProps = {
    className?: string;
    /** 위아래 여백(px) */
    spacing?: number;
    /** 선 두께(px) */
    thickness?: number;
    /** 점선 여부 */
    dashed?: boolean;
};

const HDivider: React.FC<HDividerProps> = ({ className, spacing = 16, thickness = 1, dashed = false }) => (
    <hr
        className={[styles.HDivider, dashed ? styles.Dashed : '', className].filter(Boolean).join(' ')}
        style={
            {
                ['--spacing' as never]: `${spacing}px`,
                ['--thickness' as never]: `${thickness}px`,
            } as React.CSSProperties
        }
    />
);

export default HDivider;
