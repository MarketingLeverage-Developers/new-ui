import React, { type HTMLAttributes, useCallback, useState } from 'react';
import classNames from 'classnames';
import { MdFileUpload } from 'react-icons/md';
import styles from './BaseOutlineFileUploaderDropzone.module.scss';

import { useFileUploader } from '../../../../FileUploader';

import Button from '../../../../../Button/Button';
import { GrFormUpload } from 'react-icons/gr';

export type BaseOutlineFileUploaderDropzoneProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    guideText?: string;
    buttonText?: string;
};

const BaseOutlineFileUploaderDropzone: React.FC<BaseOutlineFileUploaderDropzoneProps> = (props) => {
    const { guideText, buttonText = '파일 선택', className, ...rest } = props;

    const {
        type,
        disabled,
        isUploading,
        inputId,
        inputRef,
        accept,
        multiple,
        addFiles,
        openFileDialog,
        maxFileSizeMB,
    } = useFileUploader();

    const [isDragging, setIsDragging] = useState(false);

    const blocked = disabled || isUploading;

    const resolvedGuideText =
        guideText ??
        `업로드할 파일을 드롭하거나 파일을 선택하세요.\n(${type === 'image' ? 'jpg, png, gif' : 'pdf, jpg, png'} 파일만 업로드 가능/최대 ${maxFileSizeMB}MB)`;

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const list = e.target.files;
        if (!list) return;

        addFiles(Array.from(list));

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleDragEnter = useCallback<React.DragEventHandler<HTMLDivElement>>(
        (e) => {
            if (blocked) return;
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
        },
        [blocked]
    );

    const handleDragOver = useCallback<React.DragEventHandler<HTMLDivElement>>(
        (e) => {
            if (blocked) return;
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
        },
        [blocked]
    );

    const handleDragLeave = useCallback<React.DragEventHandler<HTMLDivElement>>((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback<React.DragEventHandler<HTMLDivElement>>(
        (e) => {
            if (blocked) return;
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const list = e.dataTransfer?.files;
            if (!list || list.length === 0) return;

            addFiles(Array.from(list));
        },
        [addFiles, blocked]
    );

    const rootClassName = classNames(
        styles.Dropzone,
        {
            [styles.Disabled]: blocked,
            [styles.Dragging]: isDragging,
        },
        className
    );

    return (
        <div
            className={rootClassName}
            {...rest}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className={styles.DescWrapper}>
                <div className={styles.Icon} aria-hidden="true">
                    <GrFormUpload />
                </div>

                <div className={styles.Text}>{resolvedGuideText}</div>
            </div>

            <Button
                variant="base"
                type="button"
                size="lg"
                radius={8}
                height={31}
                width={80}
                style={{ padding: 0 }}
                primary
                disabled={blocked}
                onClick={openFileDialog}
            >
                {isUploading ? '업로드중...' : buttonText}
            </Button>

            <input
                id={inputId}
                ref={inputRef}
                className={styles.HiddenInput}
                type="file"
                disabled={blocked}
                multiple={multiple}
                accept={accept}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default BaseOutlineFileUploaderDropzone;
