import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import styles from './BaseAlterFileUploaderDropzone.module.scss';

import { useFileUploader } from '@/shared/primitives/D/components/FileUploader/FileUploader';

import Button from '@/shared/primitives/D/components/Button/Button';
import PictureIcon from '@/shared/assets/images/Picture.svg';

export type BaseAlterFileUploaderDropzoneProps = {
    guideText?: string;
    buttonText?: string;
    className?: string;
    onChange?: (files: File[]) => void;
};

const BaseAlterFileUploaderDropzone: React.FC<BaseAlterFileUploaderDropzoneProps> = (props) => {
    const { guideText, buttonText = '파일 선택', className, onChange } = props;

    const { type, disabled, inputId, inputRef, accept, files, addFiles, openFileDialog } = useFileUploader();

    const [isDragging, setIsDragging] = useState(false);

    const file = files?.[0];

    const previewUrl = useMemo(() => {
        if (!file) return null;
        if (type !== 'image') return null;
        return URL.createObjectURL(file);
    }, [file, type]);

    useEffect(
        () => () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        },
        [previewUrl]
    );

    const resolvedGuideText = guideText ?? '이미지를 업로드 해주세요';

    const commitPicked = useCallback(
        (picked: File[]) => {
            addFiles(picked);
            onChange?.(picked);
        },
        [addFiles, onChange]
    );

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const list = e.target.files;
        if (!list || list.length === 0) return;

        const picked = [list[0]];
        commitPicked(picked);

        e.currentTarget.value = '';
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

            // ✅ 단일 이미지(첫 번째만)
            const picked = [list[0]];
            commitPicked(picked);
        },
        [commitPicked, disabled]
    );

    const rootClassName = classNames(
        styles.Dropzone,
        {
            [styles.Disabled]: disabled,
            [styles.HasImage]: !!previewUrl,
            [styles.Dragging]: isDragging,
        },
        className
    );

    return (
        <div
            className={rootClassName}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* 업로드 전 UI: stacked 느낌 */}
            <div className={styles.Stacked}>
                <img className={styles.Icon} src={PictureIcon} alt="사진" />
                <div className={styles.Text}>{resolvedGuideText}</div>

                <Button variant="base" size="md" primary disabled={disabled} onClick={openFileDialog}>
                    {buttonText}
                </Button>
            </div>

            {/* 업로드 후: 이미지로 전체 덮기 */}
            {previewUrl ? (
                <button
                    type="button"
                    className={styles.ImageOverlay}
                    onClick={openFileDialog}
                    disabled={disabled}
                    aria-label="change image"
                >
                    <img className={styles.Image} src={previewUrl} alt="uploaded" />
                </button>
            ) : null}

            <input
                id={inputId}
                ref={inputRef}
                className={styles.HiddenInput}
                type="file"
                disabled={disabled}
                multiple={false}
                accept={accept}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default BaseAlterFileUploaderDropzone;
