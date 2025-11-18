import React from 'react';
import styles from '../SummaryInfoBox.module.scss';
import type { Image } from '@/shared/types/common';

type Props = { icon: string; file: Image | undefined };
const LogoRow = ({ icon, file }: Props) => {
    const handleTextClick = async (fileUrl: string, fileName: string) => {
        if (!fileUrl || !fileName) return;
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
            console.error('로고 다운로드 실패:', error);
        }
    };

    return (
        <div className={styles.Row}>
            <img src={icon} alt="" />
            {!file?.imageUrl || !file?.imageName ? (
                '없음'
            ) : (
                <div className={styles.FileBox}>
                    <span onClick={() => handleTextClick(file?.imageUrl ?? '', file?.imageName ?? '')}>
                        {file?.imageName}
                    </span>
                </div>
            )}
        </div>
    );
};

export default LogoRow;
