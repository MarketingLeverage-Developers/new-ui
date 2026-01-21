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
};

const BaseAlterFileUploaderDropzone: React.FC<BaseAlterFileUploaderDropzoneProps> = (props) => {
    const { guideText, buttonText = '파일 선택', className } = props;

    const { type, disabled, accept, inputId, inputRef, openFileDialog, addFiles, serverItems, isUploading } =
        useFileUploader();

    const [isDragging, setIsDragging] = useState(false);

    const resolvedGuideText = guideText ?? '이미지를 업로드 해주세요';

    const previewUrl = useMemo(() => {
        if (type !== 'image') return null;

        const first = (serverItems?.[0] ?? null) as { imageUrl?: string } | null;
        if (!first?.imageUrl) return null;

        return first.imageUrl;
    }, [serverItems, type]);

    useEffect(
        () => () => {
            // ✅ FileUploader Root에서 objectURL을 만들기도 하고(로컬 tmp),
            // ✅ 서버에서 내려온 URL일 수도 있다.
            // ✅ revoke는 objectURL일 때만 안전하게 처리
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        },
        [previewUrl]
    );

    const commitPicked = useCallback(
        (picked: File[]) => {
            // ✅ Root의 addFiles가 업로더(uploader) 있으면 업로드까지 처리함
            addFiles(picked);
        },
        [addFiles]
    );

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const list = e.target.files;
        if (!list || list.length === 0) return;

        // ✅ 단일 이미지(첫 번째만)
        const picked = [list[0]];
        commitPicked(picked);

        e.currentTarget.value = '';
    };

    const handleDragEnter = useCallback<React.DragEventHandler<HTMLDivElement>>(
        (e) => {
            if (disabled || isUploading) return;
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
        },
        [disabled, isUploading]
    );

    const handleDragOver = useCallback<React.DragEventHandler<HTMLDivElement>>(
        (e) => {
            if (disabled || isUploading) return;
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
        },
        [disabled, isUploading]
    );

    const handleDragLeave = useCallback<React.DragEventHandler<HTMLDivElement>>((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback<React.DragEventHandler<HTMLDivElement>>(
        (e) => {
            if (disabled || isUploading) return;
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const list = e.dataTransfer?.files;
            if (!list || list.length === 0) return;

            // ✅ 단일 이미지(첫 번째만)
            const picked = [list[0]];
            commitPicked(picked);
        },
        [commitPicked, disabled, isUploading]
    );

    const rootClassName = classNames(
        styles.Dropzone,
        {
            [styles.Disabled]: disabled || isUploading,
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
            {/* 업로드 전 UI */}
            <div className={styles.Stacked}>
                <img className={styles.Icon} src={PictureIcon} alt="사진" />
                <div className={styles.Text}>{resolvedGuideText}</div>

                <Button variant="base" size="md" primary disabled={disabled || isUploading} onClick={openFileDialog}>
                    {buttonText}
                </Button>
            </div>

            {/* 업로드 후: 이미지로 전체 덮기 */}
            {previewUrl ? (
                <button
                    type="button"
                    className={styles.ImageOverlay}
                    onClick={openFileDialog}
                    disabled={disabled || isUploading}
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
                disabled={disabled || isUploading}
                multiple={false}
                accept={accept}
                onChange={handleInputChange}
            />
        </div>
    );
};

export default BaseAlterFileUploaderDropzone;
