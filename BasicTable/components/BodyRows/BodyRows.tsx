// BasicTable/components/BodyRows/BodyRows.tsx
import React, { useState } from 'react';
import { Row } from '../Row/Row';
import { Cell } from '../Cell/Cell';
import { RowDetailsProvider, useDetailsRenderer, useTableContext } from '@/shared/headless/TableX/Table';
import type { CSSLength } from '@/shared/types';

type RowClickArgs = {
    item: unknown;
    rowKey: string;
    opened: boolean;
    ri: number;
};

export const BodyRows = ({ height, onRowClick }: { height?: CSSLength; onRowClick?: (args: RowClickArgs) => void }) => {
    const { state } = useTableContext();
    const renderDetails = useDetailsRenderer();

    // ✅ 열린 row key 상태
    const [openRow, setOpenRow] = useState<string | null>(null);

    // ✅ toggle 함수 (RowDetailsProvider에 주입)
    const toggle = (rowKey: string) => () => {
        setOpenRow((prev) => (prev === rowKey ? null : rowKey));
    };

    return (
        <>
            {state.rows.map((row, ri) => {
                const opened = openRow === row.key;
                const detailsNode = renderDetails({ row, ri, state });

                return (
                    <React.Fragment key={row.key}>
                        {/* ✅ Toggle이 useRowDetails를 쓰기 때문에 반드시 Provider가 필요 */}
                        <RowDetailsProvider value={{ row, ri, opened, toggle: toggle(row.key) }}>
                            {/* ✅ 메인 row */}
                            <Row
                                height={height}
                                onClick={() => {
                                    onRowClick?.({
                                        item: row.item,
                                        rowKey: row.key,
                                        opened,
                                        ri,
                                    });
                                }}
                            >
                                {row.cells.map((cell, ci) => (
                                    <Cell key={`${row.key}-${cell.key}-${ci}`}>{cell.render(row.item, ri)}</Cell>
                                ))}
                            </Row>

                            {/* ✅ DetailsRow가 있을 때만 아래 row 렌더링 */}
                            {opened && detailsNode && (
                                <Row height="auto">
                                    <Cell colSpan={state.columnRow.columns.length}>
                                        <div style={{ padding: '12px 16px' }}>{detailsNode}</div>
                                    </Cell>
                                </Row>
                            )}
                        </RowDetailsProvider>
                    </React.Fragment>
                );
            })}
        </>
    );
};
