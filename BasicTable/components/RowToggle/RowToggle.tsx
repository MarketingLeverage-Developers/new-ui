import React, { useMemo } from 'react';
import { IoChevronDown, IoChevronForward } from 'react-icons/io5';
import styles from './RowToggle.module.scss';
import type { CellRenderMeta } from '@/shared/headless/AirTable/AirTable';

export type RowToggleProps<T> = {
    meta: CellRenderMeta<T>;

    /** ✅ rowKey는 optional (기존 코드 호환) */
    rowKey?: string;

    onToggle?: () => void;
    className?: string;
    style?: React.CSSProperties;
    size?: number;
    disabled?: boolean;
};

const RowToggle = <T,>({
    meta,
    rowKey,
    onToggle,
    className,
    style,
    size = 16,
    disabled = false,
}: RowToggleProps<T>) => {
    // ✅ rowKey가 없으면 meta.rowKey로 fallback
    const targetRowKey = rowKey ?? meta.rowKey;

    const isOpen = useMemo(() => meta.isRowExpanded(targetRowKey), [meta, targetRowKey]);

    return (
        <button
            type="button"
            className={[styles.root, disabled ? styles.disabled : '', className ?? ''].join(' ')}
            style={style}
            aria-expanded={isOpen}
            aria-disabled={disabled}
            disabled={disabled}
            onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (disabled) return;

                meta.toggleRowExpanded(targetRowKey);
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
