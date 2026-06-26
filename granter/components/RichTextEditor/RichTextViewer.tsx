import React from 'react';
import classNames from 'classnames';
import { isRichTextEmpty, isRichTextHtml, sanitizeRichTextHtml } from './richTextUtils';
import styles from './RichTextEditor.module.scss';

export type RichTextViewerProps = {
    value?: string | null;
    fallback?: React.ReactNode;
    className?: string;
};

const RichTextViewer = ({ value, fallback = '-', className }: RichTextViewerProps) => {
    const rawValue = String(value ?? '');

    if (isRichTextEmpty(rawValue)) {
        return <div className={classNames(styles.Viewer, className)}>{fallback}</div>;
    }

    if (!isRichTextHtml(rawValue)) {
        return <div className={classNames(styles.Viewer, className)}>{rawValue.trim()}</div>;
    }

    return (
        <div
            className={classNames(styles.Viewer, className)}
            dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(rawValue) }}
        />
    );
};

export default RichTextViewer;
