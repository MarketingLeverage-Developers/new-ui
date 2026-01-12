import React from 'react';
import styles from './ImageList.module.scss';
import FileUploader from '@/shared/headless/FileUploader/FileUploader';
import { FaCircleXmark } from 'react-icons/fa6';

export const ImageList = () => (
    <FileUploader.ImageList
        className={styles.ImageList}
        renderItem={(item, index, { remove }) => (
            <ImageItem key={item.id} item={item} index={index} actions={{ remove }} />
        )}
    />
);

type ImageItemProps = {
    item: { id: string; kind: 'image' | 'file'; name: string; size: number; type: string; url?: string | undefined };
    index: number;
    actions: { remove: () => void };
};
const ImageItem = ({ item, index, actions }: ImageItemProps) => (
    <div className={styles.ImageItem}>
        <img src={item.url} alt="이미지 미리보기" />
        <span>{item.name}</span>
        <FaCircleXmark className={styles.XMarkIcon} onClick={actions.remove} />
    </div>
);
