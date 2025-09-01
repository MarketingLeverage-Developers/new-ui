import React from 'react';
import { Dropzone, FileList, ImageList } from './components';
import ImageUploader from '@/shared/headless/ImageUploader/ImageUploader';
import styles from './BaseImageUploader.module.scss';

type BaseImageUploaderProps = {
    children: React.ReactNode;
};

const BaseImageUploader = ({ children }: BaseImageUploaderProps) => (
    <ImageUploader accept="image/*" multiple maxFiles={10}>
        <div className={styles.BaseImageUploader}>{children}</div>
    </ImageUploader>
);

export default BaseImageUploader;

BaseImageUploader.Dropzone = Dropzone;
BaseImageUploader.FileList = FileList;
BaseImageUploader.ImageList = ImageList;
