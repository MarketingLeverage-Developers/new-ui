import React, { useState } from 'react';
import { Row } from '../Row/Row';
import { Cell } from '../Cell/Cell';
import {
    RowDetailsProvider,
    useDetailsRenderer,
    useTableContext,
} from '@/shared/headless/AccordionTable/AccordionTable';

export const BodyRows: React.FC = () => {
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
        // 위는 확실히 각지게
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        // 아래만 둥글게
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        // 전역 CSS나 !important 때문에 위가 둥글게 보이는 경우를 강제로 차단
        clipPath: 'inset(0 round 0 0 8px 8px)',
    });

    return (
        <>
            {state.rows.map((row, ri) => {
                const hasHidden = row.hiddenCells.length > 0;
                const opened = openRow === row.key;
                const bg = ri % 2 === 0 ? 'var(--Gray7)' : 'var(--White1)';
                const lastIdx = row.cells.length - 1;

                return (
                    <React.Fragment key={row.key}>
                        <RowDetailsProvider value={{ row, ri, opened, hasHidden, toggle: toggle(row.key) }}>
                            <Row>
                                {row.cells.map((cell, ci) => (
                                    <Cell
                                        key={`cell-${cell.key}-${ci}`}
                                        style={getMainCellStyle(ci, lastIdx, bg, opened)}
                                    >
                                        {cell.render(row.item, ri)}
                                    </Cell>
                                ))}
                            </Row>

                            {opened && (
                                <Row>
                                    <Cell colSpan={state.columnRow.columns.length} style={getDetailsCellStyle(bg)}>
                                        <div
                                            style={{
                                                width: '100%',
                                                backgroundColor: bg,
                                                padding: '12px 16px',
                                            }}
                                        >
                                            {renderDetails({ row, ri, state })}
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
