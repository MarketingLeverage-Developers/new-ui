import React from 'react';
import styles from './ImageList.module.scss';
import FileUploader from '@/shared/headless/FileUploader/FileUploader';

export const ImageList = () => (
    <FileUploader.ImageList
        className={styles.ImageList}
        renderItem={(item) => <ImageItem key={item.id} item={item} />}
    />
);

type ImageItemProps = {
    item: { id: string; kind: 'image' | 'file'; name: string; size: number; type: string; url?: string | undefined };
};
const ImageItem = ({ item }: ImageItemProps) => (
    <div className={styles.ImageItem}>
        <img src={item.url} alt="이미지 미리보기" />
        <span>{item.name}</span>
    </div>
);
