// StripedTable/components/HeaderRows/HeaderRows.tsx
// 헤더 행(tr) + columns 기반 헤더 셀 렌더링
import type Table from '@/shared/headless/Table/Table';
import { useTableContext } from '@/shared/headless/Table/Table';
import React from 'react';
import { Row } from '../Row/Row';
import { Th } from '../Th/Th';
import type { CSSLength } from '@/shared/types';

export const HeaderRows = ({
    height = 44,
    ...props
}: React.ComponentProps<typeof Table.HeaderRows> & { height?: CSSLength }) => {
    const { state, data } = useTableContext();

    return (
        <Row height={height} {...props}>
            {state.columnRow.columns.map((col, i) => (
                <Th key={`c-${col.key}-${i}`} style={state.getColStyle(i)}>
                    {col.render(col.key, data)}
                </Th>
            ))}
        </Row>
    );
};
