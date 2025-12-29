import React, { useMemo } from 'react';
import { IoChevronDown, IoChevronForward } from 'react-icons/io5';
import styles from './RowToggle.module.scss';
import type { CellRenderMeta } from '@/shared/headless/AirTable/AirTable';

export type RowToggleProps<T> = {
    meta: CellRenderMeta<T>;
    onToggle?: () => void;
    className?: string;
    style?: React.CSSProperties;
    size?: number;
    disabled?: boolean;
};

const RowToggle = <T,>({ meta, onToggle, className, style, size = 16, disabled = false }: RowToggleProps<T>) => {
    const isOpen = useMemo(() => meta.isRowExpanded(meta.rowKey), [meta]);

    return (
        <button
            type="button"
            className={[styles.root, disabled ? styles.disabled : '', className ?? ''].join(' ')}
            style={style}
            aria-expanded={isOpen}
            aria-disabled={disabled}
            disabled={disabled}
            // ✅ 셀의 onMouseDown(선택/토글)과 충돌 방지
            onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (disabled) return;

                meta.toggleRowExpanded(meta.rowKey);
                onToggle?.();
            }}
        >
            {isOpen ? (
                <IoChevronDown size={size} className={styles.icon} />
            ) : (
                <IoChevronForward size={size} className={styles.icon} />
            )}
        </button>
    );
};

export default RowToggle;
