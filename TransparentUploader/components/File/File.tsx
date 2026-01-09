import React from 'react';
import styles from './File.module.scss';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import Folder from '@/shared/assets/images/Folder.svg';
import BaseButton from '@/shared/primitives/BaseButton/BaseButton';
import FileUploader, { useFileUploader } from '@/shared/headless/FileUploader/FileUploader';

type DropzoneProps = { openFileDialog?: () => void } & React.HTMLAttributes<HTMLDivElement>;

export const File = ({ openFileDialog }: DropzoneProps) => (
    <FileUploader.Dropzone mode={{ kind: 'file', accept: '*/*', multiple: true }}>
        {({ open }) => <DropzoneRenderer openFileDialog={open} />}
    </FileUploader.Dropzone>
);

const DropzoneRenderer = ({ openFileDialog }: DropzoneProps) => {
    const { dragging } = useFileUploader();

    return (
        <div className={styles.FileDropZoneContainer}>
            <div className={styles.FileDropzone}>
                <div className={styles.Left}>
                    <img src={Folder} alt="이미지 업로드 아이콘" />
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
                    // onClick={openFileDialog}
                >
                    파일 선택
                </BaseButton>
            </div>
            {/* <p className={styles.HelperText}>jpg, png, gif 파일만 등록할 수 있습니다.</p> */}
        </div>
    );
};
