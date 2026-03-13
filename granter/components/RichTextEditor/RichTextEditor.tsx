import React, { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import Image from '@tiptap/extension-image';
import StarterKit from '@tiptap/starter-kit';
import styles from './RichTextEditor.module.scss';

export type RichTextEditorUploadedImage = {
    src: string;
    alt?: string;
};

export type RichTextEditorProps = {
    value: string;
    onChange: (nextValue: string) => void;
    placeholder?: string;
    onUploadImages?: (files: File[]) => Promise<RichTextEditorUploadedImage[]>;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder, onUploadImages }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isEmpty, setIsEmpty] = useState(true);

    const editor = useEditor({
        extensions: [StarterKit, Image],
        content: value || '',
        onUpdate: ({ editor: ed }) => {
            const html = ed.getHTML();
            if (html !== value) {
                onChange(html);
            }
            setIsEmpty(ed.getText().length === 0);
        },
        onCreate: ({ editor: ed }) => {
            setIsEmpty(ed.getText().length === 0);
        },
    });

    useEffect(() => {
        if (!editor) return;
        const currentHtml = editor.getHTML();
        if (value !== currentHtml) {
            editor.commands.setContent(value || '', { emitUpdate: false });
            setIsEmpty(editor.getText().length === 0);
        }
    }, [editor, value]);

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (!editor || !onUploadImages) return;
        const files = event.target.files;
        if (!files || files.length === 0) return;
        const fileArray = Array.from(files);
        event.target.value = '';

        try {
            const uploadedImages = await onUploadImages(fileArray);
            uploadedImages?.forEach((image) => {
                editor.chain().focus().setImage({ src: image.src, alt: image.alt }).run();
            });
        } catch {
            // noop
        }
    };

    if (!editor) {
        return <div className={styles.Loading}>로딩 중...</div>;
    }

    const canUploadImage = Boolean(onUploadImages);

    return (
        <div className={styles.Root}>
            <div className={styles.Toolbar}>
                <button
                    type="button"
                    className={`${styles.ToolbarButton} ${editor.isActive('bold') ? styles.Active : ''}`}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    B
                </button>
                <button
                    type="button"
                    className={`${styles.ToolbarButton} ${editor.isActive('italic') ? styles.Active : ''}`}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    I
                </button>
                <button
                    type="button"
                    className={`${styles.ToolbarButton} ${editor.isActive('bulletList') ? styles.Active : ''}`}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    • List
                </button>
                <button
                    type="button"
                    className={`${styles.ToolbarButton} ${editor.isActive('orderedList') ? styles.Active : ''}`}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    1. List
                </button>

                <button
                    type="button"
                    className={`${styles.ToolbarButton} ${!canUploadImage ? styles.Disabled : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!canUploadImage}
                >
                    이미지
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple={false}
                    className={styles.HiddenInput}
                    onChange={handleFileChange}
                />

                <button
                    type="button"
                    className={`${styles.ToolbarButton} ${styles.ClearButton}`}
                    onClick={() => editor.commands.clearContent()}
                >
                    초기화
                </button>
            </div>

            <div className={styles.ContentWrap}>
                {placeholder && isEmpty ? <div className={styles.Placeholder}>{placeholder}</div> : null}
                <EditorContent editor={editor} className={styles.Content} />
            </div>
        </div>
    );
};

export default RichTextEditor;
