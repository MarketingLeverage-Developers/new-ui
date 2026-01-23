import React, { type HTMLAttributes, useCallback, useState } from 'react';
import classNames from 'classnames';
import styles from './BaseFileUploaderDropzone.module.scss';

import { useFileUploader } from '@/shared/primitives/D/components/FileUploader/FileUploader';

import Button from '@/shared/primitives/D/components/Button/Button';
import FolderIcon from '@/shared/assets/images/Folder.svg';
import PictureIcon from '@/shared/assets/images/Picture.svg';
import { Common } from '@/shared/primitives/C/Common';

export type BaseFileUploaderDropzoneProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    guideText?: string;
    buttonText?: string;
};

const BaseFileUploaderDropzone: React.FC<BaseFileUploaderDropzoneProps> = (props) => {
    const { guideText, buttonText = '파일 선택', className, ...rest } = props;

    const { type, disabled, isUploading, inputId, inputRef, accept, multiple, addFiles, openFileDialog } =
        useFileUploader();

    const [isDragging, setIsDragging] = useState(false);

    const resolvedGuideText =
        guideText ??
        (type === 'image' ? '5개 이하의 이미지를 끌어오거나 (jpg, png, gif)' : '500MB 이하의 파일을 끌어오거나 (zip)');

    const blocked = disabled || isUploading;

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
            <div className={styles.Left}>
                {type === 'file' ? (
                    <Common.Image src={FolderIcon} alt="폴더" width={60} height={60} fit="contain" />
                ) : (
                    <Common.Image src={PictureIcon} alt="사진" width={60} height={60} fit="contain" />
                )}
                <div className={styles.Text}>{resolvedGuideText}</div>
            </div>

            <Button variant="base" size="md" primary disabled={blocked} onClick={openFileDialog}>
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

export default BaseFileUploaderDropzone;
