import { useEffect } from 'react';

const normalizeCopyText = (text: string) => text.replace(/\n/g, ' ');

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
    stateRows: { key: string }[];
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
            const id = `__cell_${row.key}_${colKey}`;
            const el = document.getElementById(id);
            const text = el?.textContent ?? '';
            line.push(normalizeCopyText(text));
        }

        tsvRows.push(line.join('\t'));
    }

    return tsvRows.join('\n');
};

export const copyTextToClipboard2 = async (text: string) => {
    if (!text) return false;

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
