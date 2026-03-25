import React from 'react';
import FileUploader, { type FileUploaderProps } from '../FileUploader/FileUploader';
import { useImageUploader } from '@/shared/headless/ImageUploader/ImageUploader';
import styles from './SectionFieldRowFileUpload.module.scss';

export type SectionFieldRowFileUploadProps = Omit<FileUploaderProps, 'children'> & {
    emptyText?: string;
    buttonText?: string;
    replaceButtonText?: string;
    removeButtonText?: string;
    helperText?: string;
    removable?: boolean;
};

type TriggerContentProps = {
    emptyText: string;
    buttonText: string;
    replaceButtonText: string;
    removeButtonText: string;
    helperText?: string;
    removable: boolean;
};

const TriggerContent = ({
    emptyText,
    buttonText,
    replaceButtonText,
    removeButtonText,
    helperText,
    removable,
}: TriggerContentProps) => {
    const { imageUploaderValue, openFileDialog, clear, dragging } = useImageUploader();
    const fileCount = imageUploaderValue.length;
    const firstFile = imageUploaderValue[0];
    const buttonLabel = fileCount > 0 ? replaceButtonText : buttonText;
    const titleText =
        fileCount === 0
            ? emptyText
            : fileCount === 1
              ? firstFile?.name || firstFile?.url || emptyText
              : `${fileCount.toLocaleString('ko-KR')}개 파일 업로드됨`;

    return (
        <div className={styles.Root}>
            <button
                type="button"
                className={styles.UploadButton}
                data-dragging={dragging ? 'true' : 'false'}
                onClick={openFileDialog}
                title={helperText ? `${titleText}\n${helperText}` : titleText}
            >
                {buttonLabel}
            </button>
            {removable && fileCount > 0 ? (
                <button type="button" className={styles.RemoveButton} onClick={clear}>
                    {removeButtonText}
                </button>
            ) : null}
        </div>
    );
};

const SectionFieldRowFileUpload = ({
    className,
    emptyText = '업로드된 파일 없음',
    buttonText = '첨부파일',
    replaceButtonText = '첨부파일',
    removeButtonText = '삭제',
    helperText,
    removable = false,
    ...props
}: SectionFieldRowFileUploadProps) => (
    <FileUploader {...props} className={className}>
        <TriggerContent
            emptyText={emptyText}
            buttonText={buttonText}
            replaceButtonText={replaceButtonText}
            removeButtonText={removeButtonText}
            helperText={helperText}
            removable={removable}
        />
    </FileUploader>
);

export default SectionFieldRowFileUpload;
