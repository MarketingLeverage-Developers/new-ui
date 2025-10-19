import type Table from '@/shared/headless/Table/Table';
import { useTableContext } from '@/shared/headless/Table/Table';
import React from 'react';
import { Row } from '../Row/Row';
import { Th } from '../Th/Th';
import type { CSSLength } from '@/shared/types';

// 내부 토글 컬럼 고정 폭(px)
const TOGGLE_COL_WIDTH = 40; // [ADD]

export const HeaderRows = ({
    height = 44,
    ...props
}: React.ComponentProps<typeof Table.HeaderRows> & { height?: CSSLength }) => {
    const { state, data } = useTableContext();
    const hasAnyHidden = state.hasHidden || state.rows.some((r) => r.hiddenCells.length > 0); // [ADD] 안전 가드

    return (
        <Row height={height}>
            {/* [ADD] 내부 토글 고정 헤더셀: 숨김 컬럼 있을 때만 렌더 (빈 헤더) */}
            {hasAnyHidden && <Th style={{ width: TOGGLE_COL_WIDTH }} />}

            {state.columnRow.columns.map((col, i) => (
                <Th key={`c-${col.key}-${i}`} style={state.getColStyle(i)}>
                    {col.render(col.key, data)}
                </Th>
            ))}
        </Row>
    );
};
