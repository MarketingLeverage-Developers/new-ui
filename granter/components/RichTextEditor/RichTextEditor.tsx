import React, { useEffect, useMemo, useRef, useState, type ChangeEvent, type CSSProperties } from 'react';
import {
    EditorContent,
    NodeViewWrapper,
    ReactNodeViewRenderer,
    useEditor,
    type ReactNodeViewProps,
} from '@tiptap/react';
import Image from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';
import classNames from 'classnames';
import { FiBold, FiImage, FiItalic, FiList } from 'react-icons/fi';
import {
    getRichTextPlainText,
    isRichTextEmpty,
    toRichTextEditorContent,
} from './richTextUtils';
import styles from './RichTextEditor.module.scss';

const MIN_IMAGE_WIDTH_PERCENT = 20;
const MAX_IMAGE_WIDTH_PERCENT = 100;

export type RichTextEditorUploadedImage = {
    src: string;
    alt?: string;
    fileUUID?: string;
};

export type RichTextEditorProps = {
    value: string;
    onChange: (nextValue: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    minHeight?: number;
    maxHeight?: number;
    maxTextLength?: number;
    showCounter?: boolean;
    onUploadImages?: (files: File[]) => Promise<RichTextEditorUploadedImage[]>;
};

const getSelectionTextLength = (from: number, to: number, doc: { textBetween: (from: number, to: number) => string }) =>
    Math.max(0, doc.textBetween(from, to).length);

const clampImageWidthPercent = (value: number) =>
    Math.min(MAX_IMAGE_WIDTH_PERCENT, Math.max(MIN_IMAGE_WIDTH_PERCENT, Math.round(value)));

const getValidImageWidthPercent = (value?: string | number | null) => {
    const parsedValue = typeof value === 'number' ? value : Number.parseFloat(String(value ?? ''));
    if (!Number.isFinite(parsedValue)) return String(MAX_IMAGE_WIDTH_PERCENT);

    return String(clampImageWidthPercent(parsedValue));
};

const getStyleImageWidthPercent = (style?: string | null) => {
    const match = String(style ?? '').match(/(?:^|;)\s*width\s*:\s*([0-9]+(?:\.[0-9]+)?)%\s*(?:;|$)/i);
    return match?.[1] ?? null;
};

const getImageWidthPercentFromElement = (element: HTMLElement) =>
    getValidImageWidthPercent(element.getAttribute('data-width') ?? getStyleImageWidthPercent(element.getAttribute('style')));

const RichTextImageNodeView: React.FC<ReactNodeViewProps<HTMLDivElement>> = ({
    editor,
    node,
    selected,
    updateAttributes,
}) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const [isResizing, setIsResizing] = useState(false);
    const widthPercent = getValidImageWidthPercent(node.attrs.widthPercent);

    const handleResizePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
        if (!editor.isEditable) return;

        const wrapperElement = wrapperRef.current;
        const parentElement = wrapperElement?.parentElement;
        if (!wrapperElement || !parentElement) return;

        event.preventDefault();
        event.stopPropagation();

        const parentRect = parentElement.getBoundingClientRect();
        const parentStyle = window.getComputedStyle(parentElement);
        const parentPaddingLeft = Number.parseFloat(parentStyle.paddingLeft) || 0;
        const parentPaddingRight = Number.parseFloat(parentStyle.paddingRight) || 0;
        const resizeAreaLeft = parentRect.left + parentPaddingLeft;
        const resizeAreaWidth = parentRect.width - parentPaddingLeft - parentPaddingRight;
        if (resizeAreaWidth <= 0) return;

        const previousCursor = document.body.style.cursor;
        const previousUserSelect = document.body.style.userSelect;
        document.body.style.cursor = 'ew-resize';
        document.body.style.userSelect = 'none';
        setIsResizing(true);

        let lastWidthPercent = widthPercent;
        const updateWidth = (clientX: number) => {
            const nextWidthPercent = getValidImageWidthPercent(((clientX - resizeAreaLeft) / resizeAreaWidth) * 100);
            if (nextWidthPercent === lastWidthPercent) return;

            lastWidthPercent = nextWidthPercent;
            updateAttributes({
                widthPercent: nextWidthPercent,
            });
        };

        const handlePointerMove = (moveEvent: PointerEvent) => {
            moveEvent.preventDefault();
            updateWidth(moveEvent.clientX);
        };

        const finishResize = (clientX?: number) => {
            if (typeof clientX === 'number') {
                updateWidth(clientX);
            }
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
            document.removeEventListener('pointercancel', handlePointerCancel);
            document.body.style.cursor = previousCursor;
            document.body.style.userSelect = previousUserSelect;
            setIsResizing(false);
        };

        const handlePointerUp = (upEvent: PointerEvent) => {
            finishResize(upEvent.clientX);
        };

        const handlePointerCancel = () => {
            finishResize();
        };

        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
        document.addEventListener('pointercancel', handlePointerCancel);
    };

    return (
        <NodeViewWrapper
            ref={wrapperRef}
            as="div"
            className={classNames(
                styles.ImageNode,
                selected && styles.ImageNodeSelected,
                isResizing && styles.ImageNodeResizing
            )}
            style={{ width: `${widthPercent}%` }}
            data-width={widthPercent}
        >
            <img
                src={node.attrs.src}
                alt={node.attrs.alt ?? ''}
                data-file-uuid={node.attrs.fileUUID ?? undefined}
                draggable={false}
            />
            {editor.isEditable && (selected || isResizing) ? (
                <button
                    type="button"
                    className={styles.ImageResizeHandle}
                    aria-label="이미지 크기 조절"
                    onPointerDown={handleResizePointerDown}
                />
            ) : null}
        </NodeViewWrapper>
    );
};

const RichTextImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            fileUUID: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-file-uuid'),
                renderHTML: (attributes) => {
                    if (!attributes.fileUUID) return {};
                    return { 'data-file-uuid': attributes.fileUUID };
                },
            },
            widthPercent: {
                default: '100',
                parseHTML: (element) => getImageWidthPercentFromElement(element),
                renderHTML: (attributes) => {
                    const widthPercent = getValidImageWidthPercent(attributes.widthPercent);
                    return {
                        'data-width': widthPercent,
                        style: `width: ${widthPercent}%;`,
                    };
                },
            },
        };
    },
    addNodeView() {
        return ReactNodeViewRenderer(RichTextImageNodeView);
    },
});

const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    placeholder,
    className,
    disabled = false,
    minHeight = 172,
    maxHeight = 420,
    maxTextLength,
    showCounter = false,
    onUploadImages,
}) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const onChangeRef = useRef(onChange);
    const valueRef = useRef(value);
    const [isEmpty, setIsEmpty] = useState(true);
    const [textLength, setTextLength] = useState(() => getRichTextPlainText(value).length);
    const normalizedInitialContent = useMemo(() => toRichTextEditorContent(value), [value]);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        valueRef.current = value;
    }, [value]);

    const editor = useEditor(
        {
            extensions: [StarterKit, RichTextImage],
            content: normalizedInitialContent,
            editable: !disabled,
            editorProps: {
                attributes: {
                    class: styles.EditorSurface,
                    spellcheck: 'false',
                    autocorrect: 'off',
                    autocapitalize: 'off',
                    'data-gramm': 'false',
                },
                handleTextInput: (view, from, to, text) => {
                    if (!maxTextLength) return false;

                    const selectedLength = getSelectionTextLength(from, to, view.state.doc);
                    const currentLength = view.state.doc.textContent.length;
                    const nextLength = currentLength - selectedLength + text.length;
                    if (nextLength <= maxTextLength) return false;

                    const remainingLength = maxTextLength - (currentLength - selectedLength);
                    if (remainingLength > 0) {
                        view.dispatch(view.state.tr.insertText(text.slice(0, remainingLength), from, to));
                    }
                    return true;
                },
                handlePaste: (view, event) => {
                    if (!maxTextLength) return false;

                    const pasteText = event.clipboardData?.getData('text/plain') ?? '';
                    if (!pasteText) return false;

                    const { from, to } = view.state.selection;
                    const selectedLength = getSelectionTextLength(from, to, view.state.doc);
                    const currentLength = view.state.doc.textContent.length;
                    const remainingLength = maxTextLength - (currentLength - selectedLength);

                    if (pasteText.length <= remainingLength) return false;

                    event.preventDefault();
                    if (remainingLength > 0) {
                        view.dispatch(view.state.tr.insertText(pasteText.slice(0, remainingLength), from, to));
                    }
                    return true;
                },
            },
            onUpdate: ({ editor: ed }) => {
                const html = ed.getHTML();
                if (html !== valueRef.current) {
                    onChangeRef.current(html);
                }
                setIsEmpty(isRichTextEmpty(html));
                setTextLength(ed.getText().length);
            },
            onCreate: ({ editor: ed }) => {
                const html = ed.getHTML();
                setIsEmpty(isRichTextEmpty(html));
                setTextLength(ed.getText().length);
            },
        },
        [maxTextLength]
    );

    useEffect(() => {
        if (!editor) return;

        editor.setEditable(!disabled);
    }, [disabled, editor]);

    useEffect(() => {
        if (!editor) return;

        const nextContent = toRichTextEditorContent(value);
        if (nextContent !== editor.getHTML()) {
            editor.commands.setContent(nextContent, { emitUpdate: false });
            setIsEmpty(isRichTextEmpty(nextContent));
            setTextLength(editor.getText().length);
        }
    }, [editor, value]);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (!editor || !onUploadImages || disabled) return;

        const files = event.target.files;
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        event.target.value = '';

        try {
            const uploadedImages = await onUploadImages(fileArray);
            uploadedImages?.forEach((image) => {
                editor.chain().focus().setImage({
                    src: image.src,
                    alt: image.alt,
                    fileUUID: image.fileUUID,
                    widthPercent: '100',
                }).run();
            });
        } catch {
            // Upload errors are handled by each caller's upload flow.
        }
    };

    const rootStyle = {
        '--rich-text-editor-min-height': `${minHeight}px`,
        '--rich-text-editor-max-height': `${maxHeight}px`,
    } as CSSProperties;

    if (!editor) {
        return <div className={classNames(styles.Loading, className)}>로딩 중...</div>;
    }

    const canUploadImage = Boolean(onUploadImages) && !disabled;
    const isLengthOver = Boolean(maxTextLength && textLength >= maxTextLength);

    return (
        <div className={classNames(styles.Root, className)} data-disabled={disabled ? 'true' : 'false'} style={rootStyle}>
            <div className={styles.Toolbar}>
                <button
                    type="button"
                    className={classNames(styles.ToolbarButton, editor.isActive('bold') && styles.Active)}
                    title="굵게"
                    aria-label="굵게"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={disabled}
                >
                    <FiBold />
                </button>
                <button
                    type="button"
                    className={classNames(styles.ToolbarButton, editor.isActive('italic') && styles.Active)}
                    title="기울임"
                    aria-label="기울임"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={disabled}
                >
                    <FiItalic />
                </button>
                <span className={styles.ToolbarDivider} aria-hidden="true" />
                <button
                    type="button"
                    className={classNames(styles.ToolbarButton, editor.isActive('bulletList') && styles.Active)}
                    title="글머리 목록"
                    aria-label="글머리 목록"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    disabled={disabled}
                >
                    <FiList />
                </button>
                <button
                    type="button"
                    className={classNames(styles.ToolbarButton, editor.isActive('orderedList') && styles.Active)}
                    title="번호 목록"
                    aria-label="번호 목록"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    disabled={disabled}
                >
                    <span className={styles.OrderedIcon}>1.</span>
                </button>
                {onUploadImages ? (
                    <>
                        <span className={styles.ToolbarDivider} aria-hidden="true" />
                        <button
                            type="button"
                            className={styles.ToolbarButton}
                            title="이미지 첨부"
                            aria-label="이미지 첨부"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={!canUploadImage}
                        >
                            <FiImage />
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple={false}
                            className={styles.HiddenInput}
                            onChange={handleFileChange}
                        />
                    </>
                ) : null}
            </div>

            <div className={styles.ContentWrap}>
                {placeholder && isEmpty ? <div className={styles.Placeholder}>{placeholder}</div> : null}
                <EditorContent editor={editor} className={styles.Content} />
            </div>
            {showCounter && maxTextLength ? (
                <div className={styles.Footer}>
                    <span data-over={isLengthOver ? 'true' : 'false'}>
                        {textLength.toLocaleString()} / {maxTextLength.toLocaleString()}
                    </span>
                </div>
            ) : null}
        </div>
    );
};

export default RichTextEditor;
