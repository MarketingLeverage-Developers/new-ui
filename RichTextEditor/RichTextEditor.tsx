// src/shared/primitives/RichTextEditor/RichTextEditor.tsx
// 기능: 팁탭 기반 리치 텍스트 에디터 + (옵션) 이미지 업로드 버튼
// - 이미지 업로드 자체는 props(onUploadImages)로 주입받음

import React, { useEffect, useRef, type ChangeEvent } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

import styles from './RichTextEditor.module.scss';

type UploadedImage = {
    src: string;
    alt?: string;
};

type RichTextEditorProps = {
    value: string;
    onChange: (nextValue: string) => void;
    placeholder?: string;
    // 프로젝트별로 주입하는 이미지 업로드 함수
    onUploadImages?: (files: File[]) => Promise<UploadedImage[]>;
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange, placeholder, onUploadImages }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isEmpty, setIsEmpty] = React.useState(true);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Image, // 이미지 노드 지원
        ],
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

    // 외부에서 value가 바뀐 경우(예: 초기값 세팅, reset 등) 에디터 내용 동기화
    useEffect(() => {
        if (!editor) return;

        const currentHtml = editor.getHTML();
        if (value !== currentHtml) {
            editor.commands.setContent(value || '', { emitUpdate: false });
            // emitUpdate: false 이므로 onUpdate가 안 불려서 직접 갱신
            setIsEmpty(editor.getText().length === 0);
        }
    }, [value, editor]);

    const insertImage = (imageUrl: string): void => {
        if (!editor) return;
        editor.chain().focus().setImage({ src: imageUrl }).run();
    };

    const handleBoldClick = (): void => {
        if (!editor) return;
        editor.chain().focus().toggleBold().run();
    };

    const handleItalicClick = (): void => {
        if (!editor) return;
        editor.chain().focus().toggleItalic().run();
    };

    const handleBulletListClick = (): void => {
        if (!editor) return;
        editor.chain().focus().toggleBulletList().run();
    };

    const handleOrderedListClick = (): void => {
        if (!editor) return;
        editor.chain().focus().toggleOrderedList().run();
    };

    const handleClearClick = (): void => {
        if (!editor) return;
        editor.commands.clearContent();
    };

    const handleImageButtonClick = (): void => {
        if (!onUploadImages) {
            // 업로드 함수가 없으면 동작하지 않음
            return;
        }
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
        if (!onUploadImages) return;

        const files = event.target.files;
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        // 동일 파일 다시 선택 가능하도록 초기화
        event.target.value = '';

        try {
            const uploadedImages = await onUploadImages(fileArray);
            if (!uploadedImages || uploadedImages.length === 0) return;

            uploadedImages.forEach((image) => {
                insertImage(image.src);
            });
        } catch {
            // TODO: 필요하면 에러 로깅/토스트 처리
        }
    };

    if (!editor) {
        return <div className={styles.loading}>로딩 중...</div>;
    }

    const isBoldActive = editor.isActive('bold');
    const isItalicActive = editor.isActive('italic');
    const isBulletListActive = editor.isActive('bulletList');
    const isOrderedListActive = editor.isActive('orderedList');
    // const isEmpty = editor.getText().length === 0;
    const canUploadImage = Boolean(onUploadImages);

    return (
        <div className={styles.editorRoot}>
            {/* 툴바 영역 */}
            <div className={styles.toolbar}>
                <button
                    type="button"
                    onClick={handleBoldClick}
                    className={`${styles.toolbarButton} ${isBoldActive ? styles.active : ''}`}
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={handleItalicClick}
                    className={`${styles.toolbarButton} ${isItalicActive ? styles.active : ''}`}
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={handleBulletListClick}
                    className={`${styles.toolbarButton} ${isBulletListActive ? styles.active : ''}`}
                >
                    • List
                </button>
                <button
                    type="button"
                    onClick={handleOrderedListClick}
                    className={`${styles.toolbarButton} ${isOrderedListActive ? styles.active : ''}`}
                >
                    1. List
                </button>

                {/* 이미지 업로드 버튼 (onUploadImages 없으면 비활성 느낌) */}
                <button
                    type="button"
                    onClick={handleImageButtonClick}
                    disabled={!canUploadImage}
                    className={`${styles.toolbarButton} ${styles.toolbarButtonImage} ${
                        !canUploadImage ? styles.toolbarButtonImageDisabled : ''
                    }`}
                >
                    이미지
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    multiple={false}
                    onChange={handleFileChange}
                />

                <button
                    type="button"
                    onClick={handleClearClick}
                    className={`${styles.toolbarButton} ${styles.toolbarButtonClear}`}
                >
                    초기화
                </button>
            </div>

            {/* 에디터 영역 */}
            <div className={styles.contentWrapper}>
                {placeholder && isEmpty && <div className={styles.placeholder}>{placeholder}</div>}

                <EditorContent editor={editor} className={styles.editorContent} />
            </div>
        </div>
    );
};

export default RichTextEditor;
