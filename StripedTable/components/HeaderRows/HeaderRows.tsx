import type Table from '@/shared/headless/Table/Table';
import { useTableContext } from '@/shared/headless/Table/Table';
import React from 'react';
import { Row } from '../Row/Row';
import { Th } from '../Th/Th';
import type { CSSLength } from '@/shared/types';

const TOGGLE_COL_WIDTH = 40;

export const HeaderRows = ({
    height = 44,
    // [ADD]
    forceToggle = false,
    ...props
}: React.ComponentProps<typeof Table.HeaderRows> & { height?: CSSLength; forceToggle?: boolean }) => {
    const { state, data } = useTableContext();
    // [ADD] 히든이 있거나 강제 토글이면 토글 헤더셀을 추가
    const expandable = state.hasHidden || state.rows.some((r) => r.hiddenCells.length > 0) || forceToggle;

    return (
        <Row height={height}>
            {expandable && <Th style={{ width: TOGGLE_COL_WIDTH }} />}
            {state.columnRow.columns.map((col, i) => (
                <Th key={`c-${col.key}-${i}`} style={state.getColStyle(i)}>
                    {col.render(col.key, data)}
                </Th>
            ))}
        </Row>
    );
};
