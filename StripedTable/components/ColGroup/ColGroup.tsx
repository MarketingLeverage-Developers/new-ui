import type Table from '@/shared/headless/Table/Table';
import React from 'react';
import { useTableContext } from '@/shared/headless/Table/Table';

// 내부 토글 컬럼 고정 폭(px)
const TOGGLE_COL_WIDTH = 40; // [ADD]

export const ColGroup = (props: React.ComponentProps<typeof Table.ColGroup>) => {
    const { state } = useTableContext();
    const hasAnyHidden = state.hasHidden || state.rows.some((r) => r.hiddenCells.length > 0); // [ADD]

    return (
        <colgroup>
            {/* [ADD] 내부 토글 고정 col: 숨김 컬럼 있을 때만 삽입 */}
            {hasAnyHidden && <col style={{ width: `${TOGGLE_COL_WIDTH}px` }} />}

            {state.columnRow.columns.map((_, i) => (
                <col key={`col-${i}`} style={state.getColStyle(i)} {...props} />
            ))}
        </colgroup>
    );
};
