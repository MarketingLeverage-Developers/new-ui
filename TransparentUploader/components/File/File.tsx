// TransparentUploader.File
import React from 'react';
import styles from './File.module.scss';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import Folder from '@/shared/assets/images/Folder.svg';
import BaseButton from '@/shared/primitives/BaseButton/BaseButton';
import FileUploader, { useFileUploader } from '@/shared/headless/FileUploader/FileUploader';

const ZIP_ACCEPT = 'application/zip,application/x-zip-compressed,.zip';

export const File = () => (
    <FileUploader.Dropzone mode={{ kind: 'file', accept: ZIP_ACCEPT, multiple: true }}>
        {() => <DropzoneRenderer />}
    </FileUploader.Dropzone>
);

const DropzoneRenderer = () => {
    const { dragging, openFileDialog } = useFileUploader();

    return (
        <div className={styles.FileDropZoneContainer}>
            <div className={styles.FileDropzone}>
                <div className={styles.Left}>
                    <img src={Folder} alt="파일 업로드 아이콘" />
                    {dragging ? (
                        <p>여기에 놓으세요.</p>
                    ) : (
                        <p>
                            500MB 이하의 파일을 끌어오거나 <br />
                            (zip)
                        </p>
                    )}
                </div>

                <BaseButton
                    padding={{ y: 8, x: 12 }}
                    height={29}
                    radius={4}
                    fontSize={13}
                    bgColor={getThemeColor('Primary1')}
                    textColor={getThemeColor('White1')}
                    onClick={(e) => {
                        e.stopPropagation();
                        openFileDialog({ kind: 'file', accept: ZIP_ACCEPT, multiple: true });
                    }}
                >
                    파일 선택
                </BaseButton>
            </div>
        </div>
    );
};
