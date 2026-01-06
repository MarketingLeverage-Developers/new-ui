// src/shared/headless/AirTable/components/ColumnVisibilityControls/ColumnVisibilityControls.tsx

import React, { useMemo, useState, useCallback } from 'react';
import classNames from 'classnames';
import { FaCheck } from 'react-icons/fa';

import { useColumnVisibilityControl } from '@/shared/headless/AirTable/hooks/useColumnVisibilityControl';

import styles from './ColumnvisibilityControls.module.scss';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import ManySelect from '@/shared/headless/ManySelect/ManySelect';

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

    /** ✅ 검색어 상태 */
    const [keyword, setKeyword] = useState('');

    /** ✅ label/key 기준 필터링 */
    const filteredColumns = useMemo(() => {
        const q = keyword.trim().toLowerCase();
        if (!q) return api.allLeafColumns;

        return api.allLeafColumns.filter((col) => {
            const label = (col.label ?? '').toLowerCase();
            const key = col.key.toLowerCase();
            return label.includes(q) || key.includes(q);
        });
    }, [keyword, api.allLeafColumns]);

    /** ✅ "모두 켜기" */
    const handleAllOn = useCallback(() => {
        api.allOn();
    }, [api]);

    /** ✅ "모두 끄기" */
    const handleAllOff = useCallback(() => {
        api.allOff();
    }, [api]);

    return (
        <Dropdown>
            <ManySelect
                value={api.visibleColumnKeys}
                onChange={(next) => {
                    /** ✅ ManySelect에서 온 keys를 그대로 visibleColumnKeys에 적용 */
                    api.setVisibleColumnKeys(next);
                }}
            >
                <Dropdown.Content className={styles.Content} offset={8} placement="bottom-end">
                    {/* ✅ 검색창 */}
                    <div className={styles.SearchWrap}>
                        <input
                            className={styles.SearchInput}
                            placeholder="컬럼 검색..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>

                    {/* ✅ 전체 켜기/끄기 */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                        <button
                            type="button"
                            onClick={handleAllOn}
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
                            onClick={handleAllOff}
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

                    {/* ✅ 컬럼 목록 */}
                    <div>
                        {filteredColumns.length === 0 ? (
                            <div style={{ padding: '12px 4px', fontSize: 13, color: 'var(--Gray3)' }}>
                                검색 결과가 없습니다.
                            </div>
                        ) : (
                            filteredColumns.map((col) => {
                                const key = String(col.key);
                                const checked = api.visibleColumnKeys.includes(key);
                                const label = col.label ?? key;

                                return (
                                    <ManySelect.Item key={key} value={key} className={styles.Item}>
                                        <Checkbox label={label} checked={checked} />
                                    </ManySelect.Item>
                                );
                            })
                        )}
                    </div>
                </Dropdown.Content>

                {/* ✅ Trigger */}
                <Dropdown.Trigger className={styles.Trigger}>컬럼 설정</Dropdown.Trigger>
            </ManySelect>
        </Dropdown>
    );
};
