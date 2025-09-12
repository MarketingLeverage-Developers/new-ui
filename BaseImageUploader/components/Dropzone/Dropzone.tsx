import React from 'react';
import styles from './Dropzone.module.scss';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import Direcotry from '@/shared/assets/images/directory.png';
import BaseButton from '@/shared/primitives/BaseButton/BaseButton';
import ImageUploader, { useImageUploader } from '@/shared/headless/ImageUploader/ImageUploader';

type DropzoneProps = { openFileDialog?: () => void } & React.HTMLAttributes<HTMLDivElement>;

export const Dropzone = ({ openFileDialog }: DropzoneProps) => (
    <ImageUploader.Dropzone>{() => <DropzoneRenderer />}</ImageUploader.Dropzone>
);

const DropzoneRenderer = ({ openFileDialog }: DropzoneProps) => {
    const { dragging } = useImageUploader();

    return (
        <div className={styles.DropZoneContainer}>
            <div className={styles.Dropzone}>
                <img src={Direcotry} alt="이미지 업로드 아이콘" />
                {dragging ? <p>여기에 놓으세요.</p> : <p>파일을 드래그하여 업로드하세요.</p>}
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
            <p className={styles.HelperText}>jpg, png, gif 파일만 등록할 수 있습니다.</p>
        </div>
    );
};
