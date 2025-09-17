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
        <Row height={height}>
            {state.columnRow.columns.map((col, i) => (
                <Th key={`c-${col.key}-${i}`} style={state.getColStyle(i)}>
                    {col.render(col.key, data)}
                </Th>
            ))}
        </Row>
    );
};
