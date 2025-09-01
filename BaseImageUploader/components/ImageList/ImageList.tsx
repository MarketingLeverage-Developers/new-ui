import React from 'react';
import styles from './ImageList.module.scss';
import ImageUploader from '@/shared/headless/ImageUploader/ImageUploader';

export const ImageList = () => (
    <ImageUploader.ImageList
        className={styles.ImageList}
        renderItem={(item) => <ImageItem key={item.id} item={item} />}
    />
);

type ImageItemProps = {
    item: { id: string; url: string; name?: string };
};
const ImageItem = ({ item }: ImageItemProps) => (
    <div className={styles.ImageItem}>
        <img src={item.url} alt="이미지 미리보기" />
        <span>{item.name}</span>
    </div>
);
