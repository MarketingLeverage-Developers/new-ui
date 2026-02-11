import React, { useMemo } from 'react';
import styles from './RowToggle.module.scss';
import type { CellRenderMeta } from '@/shared/headless/AirTable/AirTable';
import { LuCircleMinus, LuCirclePlus } from 'react-icons/lu';

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

const RowToggleComponent = <T,>({
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
            {/* 기존 아이콘 로직(필요 시 복구):
            {isOpen ? (
                <IoChevronDown size={size} className={styles.icon} />
            ) : (
                <IoChevronForward size={size} className={styles.icon} />
            )}
            */}
            {isOpen ? (
                <LuCircleMinus size={size} className={styles.icon} />
            ) : (
                <LuCirclePlus size={size} className={styles.icon} />
            )}
        </button>
    );
};

/** ✅✅✅ 핵심: 제네릭 컴포넌트 타입을 명시해서 TS 추론 꼬임 방지 */
const RowToggle: <T>(props: RowToggleProps<T>) => React.ReactElement = RowToggleComponent;

export default RowToggle;
