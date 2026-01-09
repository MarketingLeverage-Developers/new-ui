import FileUploader from '@/shared/headless/FileUploader/FileUploader';
import React from 'react';
import styles from './TransparentUploader.module.scss';
import { File, Image, FileList, ImageList } from './components';

type Props = {
    children: React.ReactNode;
} & React.ComponentProps<typeof FileUploader>;

const TransparentUploader = ({ children, ...props }: Props) => (
    <FileUploader {...props}>
        <div className={styles.FileUploader}>{children}</div>
    </FileUploader>
);

export default TransparentUploader;

TransparentUploader.File = File;
TransparentUploader.Image = Image;
TransparentUploader.FileList = FileList;
TransparentUploader.ImageList = ImageList;
