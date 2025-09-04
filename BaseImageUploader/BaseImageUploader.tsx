import React from 'react';
import { Dropzone, FileList, ImageList } from './components';
import ImageUploader from '@/shared/headless/ImageUploader/ImageUploader';
import styles from './BaseImageUploader.module.scss';

type BaseImageUploaderProps = {
    children: React.ReactNode;
} & React.ComponentProps<typeof ImageUploader>;

const BaseImageUploader = ({ children, ...props }: BaseImageUploaderProps) => (
    <ImageUploader {...props}>
        <div className={styles.BaseImageUploader}>{children}</div>
    </ImageUploader>
);

export default BaseImageUploader;

BaseImageUploader.Dropzone = Dropzone;
BaseImageUploader.FileList = FileList;
BaseImageUploader.ImageList = ImageList;
