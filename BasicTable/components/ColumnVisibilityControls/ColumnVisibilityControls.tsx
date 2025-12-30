import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { FaCheck } from 'react-icons/fa';
import { useColumnVisibilityControl } from '@/shared/headless/AirTable/hooks/useColumnVisibilityControl';
import styles from './ColumnVisibilityControls.module.scss';
import BaseButton from '@/shared/primitives/BaseButton/BaseButton';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import Flex from '@/shared/primitives/Flex/Flex';

type Props = {
    portalId?: string;
};

const Checkbox = ({ label, checked }: { label: string; checked: boolean }) => {
    const checkboxClassName = classNames(styles.Checkbox, checked && styles.Active);

    return (
        <div className={styles.CheckboxWrapper}>
            <div className={checkboxClassName}>{checked && <FaCheck />}</div>
            <div className={styles.Label}>{label}</div>
        </div>
    );
};

export const ColumnVisibilityControls = <T,>({ portalId }: Props) => {
    const api = useColumnVisibilityControl<T>({ portalId });

    // ✅ 검색어 상태 추가
    const [keyword, setKeyword] = useState('');

    // ✅ label/key 기준 필터링된 목록
    const filteredColumns = useMemo(() => {
        const q = keyword.trim().toLowerCase();
        if (!q) return api.allLeafColumns;

        return api.allLeafColumns.filter((col) => {
            const label = (col.label ?? '').toLowerCase();
            const key = col.key.toLowerCase();
            return label.includes(q) || key.includes(q);
        });
    }, [keyword, api.allLeafColumns]);

    const trigger = (
        <div ref={api.wrapRef} style={{ display: 'inline-flex' }}>
            <BaseButton
                ref={api.triggerRef as any}
                padding={{ y: 8, x: 12 }}
                bgColor={getThemeColor('Gray6')}
                textColor={getThemeColor('Black1')}
                radius={6}
                height={35}
                fontSize={15}
                onClick={api.toggleOpen}
            >
                <Flex align="center" gap={8}>
                    컬럼 설정
                </Flex>
            </BaseButton>
        </div>
    );

    const dropdown = api.open && api.anchorRect && (
        <div
            ref={api.dropdownRef}
            className={styles.Content}
            style={{
                position: 'fixed',
                top: api.anchorRect.top + api.anchorRect.height + 6,
                left: api.anchorRect.left,
                zIndex: 2147483647,
            }}
        >
            {/* ✅ 검색 인풋 */}
            <div className={styles.SearchWrap}>
                <input
                    className={styles.SearchInput}
                    placeholder="컬럼 검색..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </div>

            {/* ✅ 전체 켜기/끄기 */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <button
                    type="button"
                    onClick={api.allOn}
                    style={{
                        flex: 1,
                        height: 30,
                        borderRadius: 8,
                        border: '1px solid var(--Gray5)',
                        background: 'var(--White1)',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                    }}
                >
                    모두 켜기
                </button>
                <button
                    type="button"
                    onClick={api.allOff}
                    style={{
                        flex: 1,
                        height: 30,
                        borderRadius: 8,
                        border: '1px solid var(--Gray5)',
                        background: 'var(--White1)',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                    }}
                >
                    모두 끄기
                </button>
            </div>

            {/* ✅ 필터된 목록 */}
            <div>
                {filteredColumns.length === 0 ? (
                    <div style={{ padding: '12px 4px', fontSize: 13, color: 'var(--Gray3)' }}>
                        검색 결과가 없습니다.
                    </div>
                ) : (
                    filteredColumns.map((col) => {
                        const checked = api.visibleColumnKeys.includes(col.key);
                        const label = col.label ?? col.key;

                        return (
                            <button
                                key={col.key}
                                type="button"
                                onClick={() => api.toggleColumn(col.key)}
                                className={styles.Item}
                                style={{
                                    width: '100%',
                                    background: 'transparent',
                                    border: 'none',
                                    textAlign: 'left',
                                }}
                            >
                                <Checkbox label={label} checked={checked} />
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );

    if (api.portalEl) {
        return (
            <>
                {createPortal(trigger, api.portalEl)}
                {dropdown ? createPortal(dropdown, api.portalEl) : null}
            </>
        );
    }

    return (
        <>
            {trigger}
            {dropdown}
        </>
    );
};
