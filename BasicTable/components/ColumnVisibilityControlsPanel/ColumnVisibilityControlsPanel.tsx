import React, { useMemo, useState, useCallback } from 'react';
import classNames from 'classnames';
import { FaCheck } from 'react-icons/fa';

import { useColumnVisibilityControl } from '@/shared/headless/AirTable/hooks/useColumnVisibilityControl';

import tableStyles from '../../BasicTable.module.scss'; // ✅✅✅ 이것만 사용

import ManySelect from '@/shared/headless/ManySelect/ManySelect';

type CheckboxProps = {
    label: string;
    checked: boolean;
};

const Checkbox = ({ label, checked }: CheckboxProps) => {
    const checkboxClassName = classNames(tableStyles.PanelCheckbox, checked && tableStyles.PanelCheckboxActive);

    return (
        <div className={tableStyles.PanelCheckboxWrapper}>
            <div className={checkboxClassName}>{checked && <FaCheck />}</div>
            <div className={tableStyles.PanelCheckboxLabel}>{label}</div>
        </div>
    );
};

export const ColumnVisibilityControlsPanel = <T,>() => {
    const api = useColumnVisibilityControl<T>();

    const [keyword, setKeyword] = useState('');

    const filteredColumns = useMemo(() => {
        const q = keyword.trim().toLowerCase();
        if (!q) return api.allLeafColumns;

        return api.allLeafColumns.filter((col) => {
            const label = (col.label ?? '').toLowerCase();
            const key = col.key.toLowerCase();
            return label.includes(q) || key.includes(q);
        });
    }, [keyword, api.allLeafColumns]);

    const handleAllOn = useCallback(() => {
        api.allOn();
    }, [api]);

    const handleAllOff = useCallback(() => {
        api.allOff();
    }, [api]);

    return (
        <div className={tableStyles.PanelRoot}>
            {/* ✅ 상단 고정 */}
            <div className={tableStyles.PanelHeader}>
                <div className={tableStyles.PanelSearchWrap}>
                    <input
                        className={tableStyles.PanelSearchInput}
                        placeholder="컬럼 검색..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
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
            </div>

            {/* ✅ 리스트만 스크롤 */}
            <div className={tableStyles.PanelBody}>
                <ManySelect value={api.visibleColumnKeys} onChange={(next) => api.setVisibleColumnKeys(next)}>
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
                                <ManySelect.Item key={key} value={key} className={tableStyles.PanelItem}>
                                    <Checkbox label={label} checked={checked} />
                                </ManySelect.Item>
                            );
                        })
                    )}
                </ManySelect>
            </div>
        </div>
    );
};
