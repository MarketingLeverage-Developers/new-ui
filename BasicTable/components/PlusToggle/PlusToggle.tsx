import React, { useMemo } from 'react';
import { FiPlus } from 'react-icons/fi';
import styles from './PlusToggle.module.scss';
import type { CellRenderMeta } from '@/shared/headless/AirTable/AirTable';

export type PlusToggleProps<T> = {
    meta: CellRenderMeta<T>;
    rowKey?: string;
    onToggle?: () => void;
    className?: string;
    style?: React.CSSProperties;
    size?: number;
    disabled?: boolean;
};

const PlusToggleComponent = <T,>({
    meta,
    rowKey,
    onToggle,
    className,
    style,
    size = 16,
    disabled = false,
}: PlusToggleProps<T>) => {
    const targetRowKey = rowKey ?? meta.rowKey;
    const isOpen = useMemo(() => meta.isRowExpanded(targetRowKey), [meta, targetRowKey]);

    return (
        <button
            type="button"
            className={[styles.root, isOpen ? styles.open : '', disabled ? styles.disabled : '', className ?? ''].join(
                ' '
            )}
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
            <FiPlus size={size} className={styles.icon} />
        </button>
    );
};

const PlusToggle: <T>(props: PlusToggleProps<T>) => React.ReactElement = PlusToggleComponent;

export default PlusToggle;
