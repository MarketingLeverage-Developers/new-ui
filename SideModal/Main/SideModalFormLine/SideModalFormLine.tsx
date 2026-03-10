import React from 'react';
import styles from './SideModalFormLine.module.scss';
import classNames from 'classnames';

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, [contenteditable="true"], [role="button"]';

const extractTextFromNode = (node: React.ReactNode): string => {
    if (node === null || node === undefined || typeof node === 'boolean') return '';
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(extractTextFromNode).join('');
    if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
        return extractTextFromNode(node.props.children);
    }
    return '';
};

const copyTextFallback = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.pointerEvents = 'none';

    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
};

type SideModalFormLineProps = {
    label: string;
    noBorder?: boolean;
    alignColumn?: boolean;
    clickCopy?: boolean;
    children: React.ReactNode;
};
const SideModalFormLine = ({
    label,
    children,
    noBorder = false,
    alignColumn = false,
    clickCopy = false,
}: SideModalFormLineProps) => {
    const sideModalFormLine = classNames(styles.SideModalFormLine, {
        [styles.NoBorder]: noBorder,
        [styles.AlignColumn]: alignColumn,
    });
    const copyText = extractTextFromNode(children).trim();
    const canCopy = clickCopy && copyText.length > 0;

    const handleCopy = async (event: React.MouseEvent<HTMLDivElement>) => {
        if (!canCopy) return;
        if (event.currentTarget.querySelector(INTERACTIVE_SELECTOR)) return;

        const target = event.target as HTMLElement | null;
        if (target?.closest(INTERACTIVE_SELECTOR)) return;
        if (window.getSelection()?.toString()) return;

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(copyText);
                return;
            }
            copyTextFallback(copyText);
        } catch {
            copyTextFallback(copyText);
        }
    };

    return (
        <div className={sideModalFormLine}>
            <span className={styles.Label}>{label}</span>
            <div
                className={classNames(styles.Children, { [styles.Copyable]: canCopy })}
                title={canCopy ? '클릭하여 복사' : undefined}
                onClick={handleCopy}
            >
                {children}
            </div>
        </div>
    );
};

export default SideModalFormLine;
