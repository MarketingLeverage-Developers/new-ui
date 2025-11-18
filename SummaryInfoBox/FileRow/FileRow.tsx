import React from 'react';
import styles from '../SummaryInfoBox.module.scss';
import type { File } from '@/shared/types/common';
import icon from '@/shared/assets/images/file-icon.svg';
import { IoMdCloseCircle } from 'react-icons/io';

type Props = { file: File; onDeleteClick?: () => void };
const FileRow = ({ file, onDeleteClick }: Props) => {
    const handleTextClick = async (fileUrl: string, fileName: string) => {
        try {
            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error('파일 요청 실패');

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('파일 다운로드 실패:', error);
        }
    };

    return (
        <div className={styles.Row}>
            <img src={icon} alt="" />
            <div className={styles.FileBox}>
                <span onClick={() => handleTextClick(file.filePath, file.originalFileName)}>
                    {file.originalFileName}
                </span>
                {onDeleteClick && <IoMdCloseCircle className={styles.Icon} onClick={onDeleteClick} />}
            </div>
        </div>
    );
};

export default FileRow;
