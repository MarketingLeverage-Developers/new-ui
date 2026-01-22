import React, { type HTMLAttributes, useCallback, useState } from 'react';
import classNames from 'classnames';
import styles from './BaseStackedFileUploaderDropzone.module.scss';

import { useFileUploader } from '@/shared/primitives/D/components/FileUploader/FileUploader';

import Button from '@/shared/primitives/D/components/Button/Button';
import FolderIcon from '@/shared/assets/images/Folder.svg';
import PictureIcon from '@/shared/assets/images/Picture.svg';

export type BaseStackedFileUploaderDropzoneProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    guideText?: string;
    buttonText?: string;
};

const BaseStackedFileUploaderDropzone: React.FC<BaseStackedFileUploaderDropzoneProps> = (props) => {
    const { guideText, buttonText = '파일 선택', className, ...rest } = props;

    const { type, disabled, inputId, inputRef, accept, multiple, addFiles, openFileDialog } = useFileUploader();

    const [isDragging, setIsDragging] = useState(false);

    const resolvedGuideText =
        guideText ??
        (type === 'image' ? '5개 이하의 이미지를 끌어오거나 (jpg, png, gif)' : '500MB 이하의 파일을 끌어오거나 (zip)');

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
            if (disabled) return;
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
        },
        [disabled]
    );

    const handleDragOver = useCallback<React.DragEventHandler<HTMLDivElement>>(
        (e) => {
            if (disabled) return;
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
        },
        [disabled]
    );

    const handleDragLeave = useCallback<React.DragEventHandler<HTMLDivElement>>((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback<React.DragEventHandler<HTMLDivElement>>(
        (e) => {
            if (disabled) return;
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const list = e.dataTransfer?.files;
            if (!list || list.length === 0) return;

            addFiles(Array.from(list));
        },
        [addFiles, disabled]
    );

    const rootClassName = classNames(
        styles.Dropzone,
        { [styles.Disabled]: disabled, [styles.Dragging]: isDragging },
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
            <div className={styles.Icon}>
                {type === 'file' ? <img src={FolderIcon} alt="폴더" /> : <img src={PictureIcon} alt="사진" />}
            </div>

            <div className={styles.Text}>{resolvedGuideText}</div>

            <Button variant="base" size="md" primary disabled={disabled} onClick={openFileDialog}>
                {buttonText}
            </Button>

            <input
                id={inputId}
                ref={inputRef}
                className={styles.HiddenInput}
                type="file"
                disabled={disabled}
                multiple={multiple}
                accept={accept}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default BaseStackedFileUploaderDropzone;
