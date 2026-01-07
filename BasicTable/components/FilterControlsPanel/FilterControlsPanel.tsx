// src/shared/primitives/BasicTable/components/FilterControlsPanel/FilterControlsPanel.tsx

import React, { useMemo, useState } from 'react';
import tableStyles from '../../BasicTable.module.scss';
import type { TableFilterItem } from '../../BasicTable';

type FilterControlsPanelProps = {
    items: TableFilterItem[];
};

export const FilterControlsPanel = ({ items }: FilterControlsPanelProps) => {
    const [keyword, setKeyword] = useState('');

    const filteredItems = useMemo(() => {
        const q = keyword.trim().toLowerCase();
        if (!q) return items;
        return items.filter((item) => item.label.toLowerCase().includes(q));
    }, [items, keyword]);

    return (
        <div className={tableStyles.PanelRoot}>
            {/* ✅ 상단 고정 */}
            <div className={tableStyles.PanelHeader}>
                {/* ✅ 검색 인풋 */}
                <div className={tableStyles.PanelSearchWrap}>
                    <input
                        className={tableStyles.PanelSearchInput}
                        placeholder="필터 검색..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
            </div>

            {/* ✅ 필터 UI 영역 */}
            <div className={tableStyles.PanelBody}>
                {filteredItems.length === 0 ? (
                    <div style={{ padding: 12, fontSize: 13, color: 'var(--Gray3)' }}>검색 결과가 없습니다.</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {filteredItems.map((item) => (
                            <div key={item.label} className={tableStyles.FilterItem}>
                                <div className={tableStyles.FilterLabel}>{item.label}</div>
                                <div className={tableStyles.FilterControl}>{item.element}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
