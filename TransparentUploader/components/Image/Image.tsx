// TransparentUploader.Image
import React from 'react';
import styles from './Image.module.scss';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import Picture from '@/shared/assets/images/Picture.svg';
import BaseButton from '@/shared/primitives/BaseButton/BaseButton';
import FileUploader, { useFileUploader } from '@/shared/headless/FileUploader/FileUploader';

const IMG_ACCEPT = 'image/*';

export const Image = () => (
    <FileUploader.Dropzone mode={{ kind: 'image', accept: IMG_ACCEPT, multiple: true }}>
        {() => <DropzoneRenderer />}
    </FileUploader.Dropzone>
);

const DropzoneRenderer = () => {
    const { dragging, openFileDialog } = useFileUploader();

    return (
        <div className={styles.ImageDropzoneContainer}>
            <div className={styles.ImageDropzone}>
                <div className={styles.Left}>
                    <img src={Picture} alt="이미지 업로드 아이콘" />
                    {dragging ? (
                        <p>여기에 놓으세요.</p>
                    ) : (
                        <p>
                            5개 이하의 이미지를 끌어오거나 <br />
                            (jpg, png, gif)
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
                        openFileDialog({ kind: 'image', accept: IMG_ACCEPT, multiple: true });
                    }}
                >
                    파일 선택
                </BaseButton>
            </div>
        </div>
    );
};
