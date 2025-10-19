import React, { useState } from 'react';
import { Row } from '../Row/Row';
import { Cell } from '../Cell/Cell';
import { RowDetailsProvider, useDetailsRenderer, useTableContext } from '@/shared/headless/Table/Table';
import type { CSSLength } from '@/shared/types';
import StripedTable from '../../StripedTable'; // 내부 토글 사용

// 내부 토글 고정 폭(px) — ColGroup/HeaderRows에서도 동일 상수 사용 중이어야 함
const TOGGLE_COL_WIDTH = 40;

// [ADD] 렌더 셀 타입(리터럴로 좁혀서 타입 오류 제거)
type ToggleCell = { type: 'toggle'; key: string };
type DataCell = {
    type: 'data';
    key: string;
    render: (it: unknown, idx: number) => React.ReactElement;
};
type RenderCell = ToggleCell | DataCell;

export const BodyRows = ({ height }: { height?: CSSLength }) => {
    const { state } = useTableContext();
    const renderDetails = useDetailsRenderer();
    const [openRow, setOpenRow] = useState<string | null>(null);
    const toggle = (rowKey: string) => () => setOpenRow((prev) => (prev === rowKey ? null : rowKey));

    const getMainCellStyle = (ci: number, lastIdx: number, bg: string, opened: boolean): React.CSSProperties => {
        const isFirst = ci === 0;
        const isLast = ci === lastIdx;
        return opened
            ? {
                  backgroundColor: bg,
                  borderTopLeftRadius: isFirst ? 8 : 0,
                  borderTopRightRadius: isLast ? 8 : 0,
                  borderBottomLeftRadius: 0,
                  borderBottomRightRadius: 0,
              }
            : {
                  backgroundColor: bg,
                  borderTopLeftRadius: isFirst ? 8 : 0,
                  borderBottomLeftRadius: isFirst ? 8 : 0,
                  borderTopRightRadius: isLast ? 8 : 0,
                  borderBottomRightRadius: isLast ? 8 : 0,
              };
    };

    const getDetailsCellStyle = (bg: string): React.CSSProperties => ({
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
                const hasHidden = row.hiddenCells.length > 0;
                const opened = openRow === row.key;
                const bg = ri % 2 === 0 ? 'var(--Gray7)' : 'var(--White1)';

                // [FIX] 리터럴 타입 유지('data' as const) + 명시적 DataCell 제네릭으로 타입 안정화
                const dataCells: DataCell[] = row.cells.map<DataCell>((c) => ({
                    type: 'data', // as const 불필요: 제네릭으로 DataCell 지정
                    key: c.key,
                    render: c.render as (it: unknown, idx: number) => React.ReactElement,
                }));

                // [CHANGE] 토글 셀을 같은 로우의 첫 칸으로 "주입"
                const renderCells: RenderCell[] = hasHidden
                    ? ([{ type: 'toggle', key: '__toggle__' } as ToggleCell] as RenderCell[]).concat(dataCells)
                    : dataCells;

                const lastIdx = renderCells.length - 1;

                // hasHidden일 때만 details 렌더러 호출(불필요 렌더 방지)
                const detailsNode = hasHidden ? renderDetails({ row, ri, state }) : null;

                return (
                    <React.Fragment key={row.key}>
                        <RowDetailsProvider value={{ row, ri, opened, hasHidden, toggle: toggle(row.key) }}>
                            <Row height={height}>
                                {renderCells.map((cell, ci) => {
                                    if (cell.type === 'toggle') {
                                        return (
                                            <Cell
                                                key={`cell-${cell.key}-${ci}`}
                                                style={{
                                                    ...getMainCellStyle(ci, lastIdx, bg, opened),
                                                    width: TOGGLE_COL_WIDTH,
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <StripedTable.Toggle />
                                            </Cell>
                                        );
                                    }
                                    // cell is DataCell
                                    return (
                                        <Cell
                                            key={`cell-${cell.key}-${ci}`}
                                            style={getMainCellStyle(ci, lastIdx, bg, opened)}
                                        >
                                            {cell.render(row.item, ri)}
                                        </Cell>
                                    );
                                })}
                            </Row>

                            {hasHidden && opened && detailsNode && (
                                <Row>
                                    {/* 토글 열이 붙은 만큼 colSpan +1 */}
                                    <Cell
                                        colSpan={state.columnRow.columns.length + (hasHidden ? 1 : 0)}
                                        style={getDetailsCellStyle(bg)}
                                    >
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
