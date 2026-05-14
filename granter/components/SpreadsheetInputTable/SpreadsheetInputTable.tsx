import type {
    ComponentProps,
    CSSProperties,
    ReactNode,
    ClipboardEvent,
    MouseEvent,
} from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './SpreadsheetInputTable.module.scss';

export type SpreadsheetInputTableColumn<Row = unknown> = {
    key: string;
    label: ReactNode;
    width?: number | string;
    align?: 'left' | 'center' | 'right';
    className?: string;
    headerClassName?: string;
};

export type SpreadsheetInputTableEditableCell<Row> = {
    columnKey: string;
    getValue: (row: Row, rowIndex: number) => string;
    onValueChange: (row: Row, value: string, rowIndex: number) => void;
    onPasteValues?: (rowIndex: number, values: string[]) => void;
    parsePastedValues?: (text: string) => string[];
    disabled?: boolean | ((row: Row, rowIndex: number) => boolean);
    placeholder?: string;
    suffix?: ReactNode;
    inputMode?: ComponentProps<'input'>['inputMode'];
    ariaLabel?: (row: Row, rowIndex: number) => string;
};

export type SpreadsheetInputTableProps<Row> = {
    columns: SpreadsheetInputTableColumn<Row>[];
    rows: Row[];
    rowKey: (row: Row, rowIndex: number) => string;
    renderCell: (row: Row, column: SpreadsheetInputTableColumn<Row>, rowIndex: number) => ReactNode;
    editableCell?: SpreadsheetInputTableEditableCell<Row>;
    editableCells?: SpreadsheetInputTableEditableCell<Row>[];
    hint?: ReactNode;
    assistiveBadge?: ReactNode;
    headerAction?: ReactNode;
    emptyContent?: ReactNode;
    minWidth?: number | string;
    edge?: 'default' | 'open';
    enableRangeSelection?: boolean;
    className?: string;
    style?: CSSProperties;
};

type CellAddress = {
    rowIndex: number;
    columnKey: string;
};

type CellSelection = {
    anchor: CellAddress;
    focus: CellAddress;
};

const toCssWidth = (width?: number | string) => {
    if (width === undefined) return undefined;
    return typeof width === 'number' ? `${width}px` : width;
};

const parseDefaultPastedValues = (text: string) =>
    text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const cells = line
                .split('\t')
                .map((cell) => cell.trim())
                .filter(Boolean);

            return cells[cells.length - 1] ?? '';
        })
        .filter(Boolean);

const parseClipboardMatrix = (text: string) => {
    const normalizedText = text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\n$/, '');

    if (!normalizedText) return [];

    return normalizedText
        .split('\n')
        .filter((line) => line.length > 0)
        .map((line) => line.split('\t'));
};

const SpreadsheetInputTable = <Row,>({
    columns,
    rows,
    rowKey,
    renderCell,
    editableCell,
    editableCells,
    hint,
    assistiveBadge,
    headerAction,
    emptyContent,
    minWidth = 640,
    edge = 'default',
    enableRangeSelection = false,
    className,
    style,
}: SpreadsheetInputTableProps<Row>) => {
    const [selection, setSelection] = useState<CellSelection | null>(null);
    const isSelectingRef = useRef(false);
    const rootClassName = [
        styles.Root,
        className,
    ].filter(Boolean).join(' ');
    const editableCellByColumnKey = useMemo(() => {
        const next = new Map<string, SpreadsheetInputTableEditableCell<Row>>();

        if (editableCell) {
            next.set(editableCell.columnKey, editableCell);
        }

        for (const cell of editableCells ?? []) {
            next.set(cell.columnKey, cell);
        }

        return next;
    }, [editableCell, editableCells]);
    const editableColumnKeys = useMemo(
        () => columns
            .filter((column) => editableCellByColumnKey.has(column.key))
            .map((column) => column.key),
        [columns, editableCellByColumnKey]
    );

    useEffect(() => {
        const handleMouseUp = () => {
            isSelectingRef.current = false;
        };

        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    useEffect(() => {
        if (!selection) return;

        const anchorColumnExists = editableColumnKeys.includes(selection.anchor.columnKey);
        const focusColumnExists = editableColumnKeys.includes(selection.focus.columnKey);
        const rowExists = selection.anchor.rowIndex < rows.length && selection.focus.rowIndex < rows.length;

        if (!anchorColumnExists || !focusColumnExists || !rowExists) {
            setSelection(null);
        }
    }, [editableColumnKeys, rows.length, selection]);

    const getSelectionBounds = (targetSelection: CellSelection | null) => {
        if (!targetSelection) return null;

        const anchorColumnIndex = editableColumnKeys.indexOf(targetSelection.anchor.columnKey);
        const focusColumnIndex = editableColumnKeys.indexOf(targetSelection.focus.columnKey);

        if (anchorColumnIndex < 0 || focusColumnIndex < 0) return null;

        return {
            rowStart: Math.min(targetSelection.anchor.rowIndex, targetSelection.focus.rowIndex),
            rowEnd: Math.max(targetSelection.anchor.rowIndex, targetSelection.focus.rowIndex),
            columnStart: Math.min(anchorColumnIndex, focusColumnIndex),
            columnEnd: Math.max(anchorColumnIndex, focusColumnIndex),
        };
    };

    const isCellSelected = (rowIndex: number, columnKey: string) => {
        if (!enableRangeSelection) return false;

        const bounds = getSelectionBounds(selection);
        if (!bounds) return false;

        const columnIndex = editableColumnKeys.indexOf(columnKey);
        if (columnIndex < 0) return false;

        return rowIndex >= bounds.rowStart
            && rowIndex <= bounds.rowEnd
            && columnIndex >= bounds.columnStart
            && columnIndex <= bounds.columnEnd;
    };

    const isCellAnchor = (rowIndex: number, columnKey: string) =>
        enableRangeSelection
        && selection?.anchor.rowIndex === rowIndex
        && selection.anchor.columnKey === columnKey;

    const isCellDisabled = (
        cell: SpreadsheetInputTableEditableCell<Row> | undefined,
        row: Row,
        rowIndex: number
    ) => {
        if (!cell) return false;

        return typeof cell.disabled === 'function'
            ? cell.disabled(row, rowIndex)
            : Boolean(cell.disabled);
    };

    const getParsedValueForCell = (
        cell: SpreadsheetInputTableEditableCell<Row>,
        rawValue: string
    ) => {
        const pastedValues = (cell.parsePastedValues ?? parseDefaultPastedValues)(rawValue);

        return pastedValues[0] ?? null;
    };

    const pasteRangeValues = (
        event: ClipboardEvent<HTMLInputElement>,
        rowIndex: number,
        columnKey: string
    ) => {
        if (!enableRangeSelection) return false;

        const text = event.clipboardData.getData('text');
        const matrix = parseClipboardMatrix(text);
        if (matrix.length === 0) return false;

        const activeColumnIndex = editableColumnKeys.indexOf(columnKey);
        if (activeColumnIndex < 0) return false;

        const selectionBounds = getSelectionBounds(selection);
        const selectedBounds = selectionBounds && isCellSelected(rowIndex, columnKey)
            ? selectionBounds
            : null;
        const hasSelectedRange = Boolean(
            selectedBounds
            && (selectedBounds.rowEnd > selectedBounds.rowStart || selectedBounds.columnEnd > selectedBounds.columnStart)
        );
        const startRowIndex = selectedBounds?.rowStart ?? rowIndex;
        const startColumnIndex = selectedBounds?.columnStart ?? activeColumnIndex;
        const selectedRowCount = selectedBounds
            ? selectedBounds.rowEnd - selectedBounds.rowStart + 1
            : 1;
        const selectedColumnCount = selectedBounds
            ? selectedBounds.columnEnd - selectedBounds.columnStart + 1
            : 1;
        const matrixColumnCount = Math.max(...matrix.map((row) => row.length));
        const isSinglePastedCell = matrix.length === 1 && matrixColumnCount === 1;
        const targetRowCount = hasSelectedRange ? selectedRowCount : matrix.length;
        const targetColumnCount = hasSelectedRange ? selectedColumnCount : matrixColumnCount;

        if (
            !hasSelectedRange
            && isSinglePastedCell
            && !text.includes('\n')
            && !text.includes('\t')
        ) {
            return false;
        }

        event.preventDefault();

        for (let columnOffset = 0; columnOffset < targetColumnCount; columnOffset += 1) {
            const targetColumnKey = editableColumnKeys[startColumnIndex + columnOffset];
            if (!targetColumnKey) continue;

            const targetEditableCell = editableCellByColumnKey.get(targetColumnKey);
            if (!targetEditableCell) continue;

            const values: string[] = [];

            for (let rowOffset = 0; rowOffset < targetRowCount; rowOffset += 1) {
                const targetRowIndex = startRowIndex + rowOffset;
                const targetRow = rows[targetRowIndex];
                if (!targetRow) break;

                if (isCellDisabled(targetEditableCell, targetRow, targetRowIndex)) {
                    values.push(targetEditableCell.getValue(targetRow, targetRowIndex));
                    continue;
                }

                const rawValue = isSinglePastedCell
                    ? matrix[0]?.[0]
                    : matrix[rowOffset]?.[columnOffset];
                const parsedValue = rawValue !== undefined
                    ? getParsedValueForCell(targetEditableCell, rawValue)
                    : null;

                values.push(parsedValue ?? targetEditableCell.getValue(targetRow, targetRowIndex));
            }

            if (values.length === 0) continue;

            if (targetEditableCell.onPasteValues) {
                targetEditableCell.onPasteValues(startRowIndex, values);
                continue;
            }

            values.forEach((value, offset) => {
                const targetRowIndex = startRowIndex + offset;
                const targetRow = rows[targetRowIndex];
                if (!targetRow) return;
                targetEditableCell.onValueChange(targetRow, value, targetRowIndex);
            });
        }

        return true;
    };

    const startRangeSelection = (
        event: MouseEvent<HTMLTableCellElement>,
        rowIndex: number,
        columnKey: string,
        disabled: boolean
    ) => {
        if (!enableRangeSelection || disabled || event.button !== 0) return;

        isSelectingRef.current = true;
        setSelection({
            anchor: { rowIndex, columnKey },
            focus: { rowIndex, columnKey },
        });
    };

    const extendRangeSelection = (
        rowIndex: number,
        columnKey: string,
        disabled: boolean
    ) => {
        if (!enableRangeSelection || disabled || !isSelectingRef.current) return;

        setSelection((prev) => {
            if (!prev) {
                return {
                    anchor: { rowIndex, columnKey },
                    focus: { rowIndex, columnKey },
                };
            }

            return {
                ...prev,
                focus: { rowIndex, columnKey },
            };
        });
    };

    return (
        <div className={rootClassName} style={style}>
            {hint || assistiveBadge || headerAction ? (
                <div className={styles.Hint}>
                    {hint ? <div className={styles.HintContent}>{hint}</div> : <span />}
                    {headerAction ? (
                        <div className={styles.HeaderAction}>{headerAction}</div>
                    ) : assistiveBadge ? (
                        <div className={styles.AssistiveBadge}>{assistiveBadge}</div>
                    ) : null}
                </div>
            ) : null}

            <div
                className={styles.Scroller}
                data-edge={edge}
                data-range-selection={enableRangeSelection ? 'true' : undefined}
            >
                <table
                    className={styles.Table}
                    style={{ minWidth: toCssWidth(minWidth) }}
                >
                    <colgroup>
                        {columns.map((column) => (
                            <col
                                key={column.key}
                                style={{ width: toCssWidth(column.width) }}
                            />
                        ))}
                    </colgroup>
                    <thead>
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={column.headerClassName}
                                    data-align={column.align ?? 'center'}
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className={styles.EmptyCell}>
                                    {emptyContent ?? '데이터가 없습니다.'}
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, rowIndex) => (
                                <tr key={rowKey(row, rowIndex)}>
                                    {columns.map((column) => {
                                        const activeEditableCell = editableCellByColumnKey.get(column.key);
                                        const isDisabled = isCellDisabled(activeEditableCell, row, rowIndex);

                                        if (activeEditableCell) {
                                            const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
                                                if (pasteRangeValues(event, rowIndex, column.key)) {
                                                    return;
                                                }

                                                const text = event.clipboardData.getData('text');
                                                const pastedValues = (activeEditableCell.parsePastedValues ?? parseDefaultPastedValues)(text);

                                                if (pastedValues.length === 0) return;
                                                if (pastedValues.length === 1 && !text.includes('\n') && !text.includes('\t')) return;

                                                event.preventDefault();
                                                activeEditableCell.onPasteValues?.(rowIndex, pastedValues);
                                            };

                                            return (
                                                <td
                                                    key={column.key}
                                                    className={[styles.AmountCell, column.className].filter(Boolean).join(' ')}
                                                    data-align={column.align ?? 'right'}
                                                    data-selected={isCellSelected(rowIndex, column.key) ? 'true' : undefined}
                                                    data-anchor={isCellAnchor(rowIndex, column.key) ? 'true' : undefined}
                                                    onMouseDown={(event) => startRangeSelection(event, rowIndex, column.key, isDisabled)}
                                                    onMouseEnter={() => extendRangeSelection(rowIndex, column.key, isDisabled)}
                                                >
                                                    <label className={styles.AmountField}>
                                                        <input
                                                            type="text"
                                                            inputMode={activeEditableCell.inputMode ?? 'numeric'}
                                                            value={activeEditableCell.getValue(row, rowIndex)}
                                                            onChange={(event) => activeEditableCell.onValueChange(row, event.target.value, rowIndex)}
                                                            onPaste={handlePaste}
                                                            placeholder={activeEditableCell.placeholder}
                                                            disabled={isDisabled}
                                                            className={styles.AmountInput}
                                                            aria-label={activeEditableCell.ariaLabel?.(row, rowIndex)}
                                                        />
                                                        {activeEditableCell.suffix ? (
                                                            <span className={styles.AmountSuffix}>{activeEditableCell.suffix}</span>
                                                        ) : null}
                                                    </label>
                                                </td>
                                            );
                                        }

                                        return (
                                            <td
                                                key={column.key}
                                                className={column.className}
                                                data-align={column.align ?? 'center'}
                                            >
                                                {renderCell(row, column, rowIndex)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SpreadsheetInputTable;
