import React, { useEffect, useMemo, useRef, useState, type ChangeEvent, type CSSProperties } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
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
        };
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
