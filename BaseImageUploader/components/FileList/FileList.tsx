import React from 'react';
import styles from './FileList.module.scss';
import { FaCircleXmark } from 'react-icons/fa6';
import ImageUploader from '@/shared/headless/ImageUploader/ImageUploader';

export const FileList = () => (
    <ImageUploader.FileList
        className={styles.FileList}
        renderItem={(item, index, { remove }) => (
            <FileItem key={item.id} item={item} index={index} actions={{ remove }} />
        )}
    />
);

type FileItemProps = {
    item: { id: string; url: string; name?: string };
    index: number;
    actions: { remove: () => void };
} & React.HTMLAttributes<HTMLDivElement>;

const FileItem = ({ item, index, actions }: FileItemProps) => (
    <div className={styles.FileItem}>
        <div className={styles.Text}>
            <span className={styles.Name}>{item.name}</span>
            <span className={styles.Size}>{'3MB'}</span>
        </div>

        <FaCircleXmark className={styles.XMarkIcon} onClick={actions.remove} />
    </div>
);
