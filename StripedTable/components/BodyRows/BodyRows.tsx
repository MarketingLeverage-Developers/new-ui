// StripedTable/components/BodyRows/BodyRows.tsx
// 줄무늬 + 디테일 행을 렌더링하는 BodyRows (토글 컬럼은 columns에서 직접 정의)
import React, { useState } from 'react';
import type { CSSProperties } from 'react';
import { Row } from '../Row/Row';
import { Cell } from '../Cell/Cell';
import { RowDetailsProvider, useDetailsRenderer, useTableContext } from '@/shared/headless/Table/Table';
import type { CSSLength } from '@/shared/types';
import type { ToggleClickArgs } from '../Toggle/Toggle';

type DataCell = {
    key: string;
    render: (it: unknown, idx: number) => React.ReactElement;
};

type RowClickArgs = ToggleClickArgs;

export const BodyRows = ({ height, onRowClick }: { height?: CSSLength; onRowClick?: (args: RowClickArgs) => void }) => {
    const { state } = useTableContext();
    const renderDetails = useDetailsRenderer();
    const [openRow, setOpenRow] = useState<string | null>(null);

    const toggle = (rowKey: string) => () => setOpenRow((prev) => (prev === rowKey ? null : rowKey));

    const getMainCellStyle = (ci: number, lastIdx: number, bg: string, opened: boolean): CSSProperties => {
        const isFirst = ci === 0;
        const isLast = ci === lastIdx;

        if (opened) {
            return {
                backgroundColor: bg,
                borderTopLeftRadius: isFirst ? 8 : 0,
                borderTopRightRadius: isLast ? 8 : 0,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
            };
        }

        return {
            backgroundColor: bg,
            borderTopLeftRadius: isFirst ? 8 : 0,
            borderBottomLeftRadius: isFirst ? 8 : 0,
            borderTopRightRadius: isLast ? 8 : 0,
            borderBottomRightRadius: isLast ? 8 : 0,
        };
    };

    const getDetailsCellStyle = (bg: string): CSSProperties => ({
        backgroundColor: bg,
        padding: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        clipPath: 'inset(0 round 0 0 8px 8px)',
    });

    return (
        <>
            {state.rows.map((row, ri) => {
                const opened = openRow === row.key;
                const bg = ri % 2 === 0 ? 'var(--Gray7)' : 'var(--White1)';

                const dataCells: DataCell[] = row.cells.map<DataCell>((c) => ({
                    key: c.key,
                    render: c.render as (it: unknown, idx: number) => React.ReactElement,
                }));

                const lastIdx = dataCells.length - 1;
                const detailsNode = renderDetails({ row, ri, state });

                return (
                    <React.Fragment key={row.key}>
                        {/* 각 행에 대한 디테일 컨텍스트 주입 */}
                        <RowDetailsProvider value={{ row, ri, opened, toggle: toggle(row.key) }}>
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
                                {dataCells.map((cell, ci) => (
                                    <Cell
                                        key={`cell-${cell.key}-${ci}`}
                                        style={getMainCellStyle(ci, lastIdx, bg, opened)}
                                    >
                                        {cell.render(row.item, ri)}
                                    </Cell>
                                ))}
                            </Row>

                            {/* 디테일 행: 토글 상태에 따라 렌더링 */}
                            {opened && detailsNode && (
                                <Row>
                                    <Cell colSpan={state.columnRow.columns.length} style={getDetailsCellStyle(bg)}>
                                        <div style={{ width: '100%', backgroundColor: bg, padding: '12px 16px' }}>
                                            {detailsNode}
                                        </div>
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
