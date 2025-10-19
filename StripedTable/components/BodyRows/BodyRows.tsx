import React, { useState } from 'react';
import { Row } from '../Row/Row';
import { Cell } from '../Cell/Cell';
import { RowDetailsProvider, useDetailsRenderer, useTableContext } from '@/shared/headless/Table/Table';
import type { CSSLength } from '@/shared/types';
import StripedTable from '../../StripedTable';
import type { ToggleClickArgs } from '../Toggle/Toggle'; // [ADD]

// 내부 토글 고정 폭(px)
const TOGGLE_COL_WIDTH = 40;

type ToggleCell = { type: 'toggle'; key: string };
type DataCell = {
    type: 'data';
    key: string;
    render: (it: unknown, idx: number) => React.ReactElement;
};
type RenderCell = ToggleCell | DataCell;

export const BodyRows = ({
    height,
    // [KEEP] 히든이 없어도 토글을 항상 보이게 하는 옵션
    forceToggle = false,
    // [ADD] 토글 클릭 콜백
    onToggle,
}: {
    height?: CSSLength;
    forceToggle?: boolean;
    onToggle?: (args: ToggleClickArgs) => void;
}) => {
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
                const expandable = hasHidden || forceToggle;

                const opened = openRow === row.key;
                const bg = ri % 2 === 0 ? 'var(--Gray7)' : 'var(--White1)';

                const dataCells: DataCell[] = row.cells.map<DataCell>((c) => ({
                    type: 'data',
                    key: c.key,
                    render: c.render as (it: unknown, idx: number) => React.ReactElement,
                }));

                const renderCells: RenderCell[] = expandable
                    ? ([{ type: 'toggle', key: '__toggle__' } as ToggleCell] as RenderCell[]).concat(dataCells)
                    : dataCells;

                const lastIdx = renderCells.length - 1;
                const detailsNode = expandable ? renderDetails({ row, ri, state }) : null;

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
                                                {/* [CHANGE] onToggle 전달 */}
                                                <StripedTable.Toggle onToggle={onToggle} />
                                            </Cell>
                                        );
                                    }
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

                            {expandable && opened && detailsNode && (
                                <Row>
                                    <Cell
                                        colSpan={state.columnRow.columns.length + (expandable ? 1 : 0)}
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
