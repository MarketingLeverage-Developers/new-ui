import React, { useEffect } from 'react';

const normalizeCopyText = (text: string) => text.replace(/\r?\n/g, ' ').replace(/\t/g, ' ');

type CopyRow = {
    key: string;
    level?: number;
    item?: unknown;
    cells?: Array<{
        key: string;
        copyValue?: (item: unknown, rowIndex: number, meta: Record<string, unknown>) => string | number | null | undefined;
        render?: (item: unknown, rowIndex: number, meta: Record<string, unknown>) => React.ReactNode;
    }>;
};

const getDomCellText = (row: CopyRow, colKey: string) => {
    const id = `__cell_${row.key}_${colKey}`;
    const el = document.getElementById(id);
    if (!el) return undefined;

    const input = el.querySelector('input, textarea, select');
    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement) {
        return input.value;
    }

    return el.textContent ?? '';
};

const extractReactNodeText = (node: React.ReactNode): string => {
    if (node === null || node === undefined || typeof node === 'boolean') return '';
    if (typeof node === 'string' || typeof node === 'number' || typeof node === 'bigint') return String(node);
    if (Array.isArray(node)) return node.map(extractReactNodeText).join('');

    if (React.isValidElement(node)) {
        const props = node.props as {
            children?: React.ReactNode;
            value?: unknown;
            title?: unknown;
            'aria-label'?: unknown;
        };

        const childrenText = extractReactNodeText(props.children);
        if (childrenText) return childrenText;

        if (typeof props.value === 'string' || typeof props.value === 'number') return String(props.value);
        if (typeof props.title === 'string' || typeof props.title === 'number') return String(props.title);
        if (typeof props['aria-label'] === 'string' || typeof props['aria-label'] === 'number') {
            return String(props['aria-label']);
        }
    }

    return '';
};

const getRenderedCellText = (row: CopyRow, colKey: string, rowIndex: number, rowCount: number) => {
    const cell = row.cells?.find((item) => item.key === colKey);
    if (!cell?.render) return '';

    try {
        return extractReactNodeText(
            cell.render(row.item, rowIndex, {
                rowKey: row.key,
                ri: rowIndex,
                rowCount,
                level: row.level,
                toggleRowExpanded: () => undefined,
                isRowExpanded: () => false,
            })
        );
    } catch {
        return '';
    }
};

const getExplicitCellCopyText = (row: CopyRow, colKey: string, rowIndex: number, rowCount: number) => {
    const cell = row.cells?.find((item) => item.key === colKey);
    if (!cell?.copyValue) return undefined;

    try {
        const value = cell.copyValue(row.item, rowIndex, {
            rowKey: row.key,
            ri: rowIndex,
            rowCount,
            level: row.level,
            toggleRowExpanded: () => undefined,
            isRowExpanded: () => false,
        });

        if (value === null || value === undefined) return '';
        return String(value);
    } catch {
        return undefined;
    }
};

const getFallbackCellText = (row: CopyRow, colKey: string) => {
    const item = row.item;
    if (!item || typeof item !== 'object') return '';

    const value = (item as Record<string, unknown>)[colKey];
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return '';
    if (value instanceof Date) return value.toISOString();
    if (typeof value === 'object') return '';

    return String(value);
};

const getCellCopyText = (row: CopyRow, colKey: string, rowIndex: number, rowCount: number) => {
    const domText = getDomCellText(row, colKey);
    if (domText !== undefined && domText !== '') return normalizeCopyText(domText);

    const explicitText = getExplicitCellCopyText(row, colKey, rowIndex, rowCount);
    if (explicitText !== undefined) return normalizeCopyText(explicitText);

    const renderedText = getRenderedCellText(row, colKey, rowIndex, rowCount);
    if (renderedText) return normalizeCopyText(renderedText);

    return normalizeCopyText(getFallbackCellText(row, colKey));
};

const isEditableElement = (el: HTMLElement | null) =>
    el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || !!el?.isContentEditable;

const isAirTableTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return true;

    const anchorEl = selection.anchorNode instanceof Element ? selection.anchorNode : selection.anchorNode?.parentElement;
    const focusEl = selection.focusNode instanceof Element ? selection.focusNode : selection.focusNode?.parentElement;

    return !!(anchorEl?.closest?.('[id^="__cell_"]') || focusEl?.closest?.('[id^="__cell_"]'));
};

export const buildSelectionTsv2 = ({
    stateRows,
    baseOrder,
    range,
    includeHeaders = false,
}: {
    stateRows: CopyRow[];
    baseOrder: string[];
    range: { top: number; bottom: number; left: number; right: number };
    includeHeaders?: boolean;
}) => {
    const tsvRows: string[] = [];

    if (includeHeaders) {
        const headerLine: string[] = [];

        for (let ci = range.left; ci <= range.right; ci += 1) {
            const colKey = baseOrder[ci];
            const el = document.getElementById(`__header_${colKey}`);
            const text = el?.textContent ?? '';
            headerLine.push(normalizeCopyText(text));
        }

        tsvRows.push(headerLine.join('\t'));
    }

    for (let ri = range.top; ri <= range.bottom; ri += 1) {
        const row = stateRows[ri];
        if (!row) continue;

        const line: string[] = [];

        for (let ci = range.left; ci <= range.right; ci += 1) {
            const colKey = baseOrder[ci];
            line.push(getCellCopyText(row, colKey, ri, stateRows.length));
        }

        tsvRows.push(line.join('\t'));
    }

    return tsvRows.join('\n');
};

export const buildColumnTsv2 = ({
    stateRows,
    colKey,
}: {
    stateRows: CopyRow[];
    colKey: string;
}) => {
    const tsvRows: string[] = [];

    stateRows.forEach((row, rowIndex) => {
        tsvRows.push(getCellCopyText(row, colKey, rowIndex, stateRows.length));
    });

    return tsvRows.join('\n');
};

const copyTextByCopyEvent = (text: string) => {
    let copied = false;

    const handleCopy = (event: ClipboardEvent) => {
        event.clipboardData?.setData('text/plain', text);
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        copied = true;
    };

    document.addEventListener('copy', handleCopy, true);

    try {
        const ok = document.execCommand('copy');
        return copied || ok;
    } finally {
        document.removeEventListener('copy', handleCopy, true);
    }
};

export const copyTextToClipboard2 = async (text: string) => {
    if (!text) return false;

    if (copyTextByCopyEvent(text)) return true;

    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', 'true');
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        textarea.style.left = '-9999px';

        document.body.appendChild(textarea);
        textarea.select();

        try {
            return document.execCommand('copy');
        } finally {
            document.body.removeChild(textarea);
        }
    }
};

export const useCopySelection2 = ({
    stateRows,
    baseOrder,
    getRange,
    draggingKey,
}: {
    stateRows: { key: string }[];
    baseOrder: string[];
    getRange: () => { top: number; bottom: number; left: number; right: number } | null;
    draggingKey: string | null;
}) => {
    useEffect(() => {
        const handleCopy = (e: ClipboardEvent) => {
            const activeEl = document.activeElement as HTMLElement | null;
            if (isEditableElement(activeEl)) return;
            if (!isAirTableTextSelection()) return;

            const r = getRange();
            if (!r) return;
            if (draggingKey) return;

            const tsv = buildSelectionTsv2({
                stateRows,
                baseOrder,
                range: r,
            });
            e.clipboardData?.setData('text/plain', tsv);
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            const isCopyWithHeaders = (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c';
            if (!isCopyWithHeaders) return;

            const activeEl = document.activeElement as HTMLElement | null;
            if (isEditableElement(activeEl)) return;
            if (!isAirTableTextSelection()) return;

            const r = getRange();
            if (!r) return;
            if (draggingKey) return;

            e.preventDefault();
            e.stopPropagation();

            const tsv = buildSelectionTsv2({
                stateRows,
                baseOrder,
                range: r,
                includeHeaders: true,
            });

            void copyTextToClipboard2(tsv);
        };

        window.addEventListener('copy', handleCopy);
        window.addEventListener('keydown', handleKeyDown, true);

        return () => {
            window.removeEventListener('copy', handleCopy);
            window.removeEventListener('keydown', handleKeyDown, true);
        };
    }, [stateRows, baseOrder, getRange, draggingKey]);
};
