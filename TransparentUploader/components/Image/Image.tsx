import React from 'react';
import styles from './Image.module.scss';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import Picture from '@/shared/assets/images/Picture.svg';
import BaseButton from '@/shared/primitives/BaseButton/BaseButton';
import FileUploader, { useFileUploader } from '@/shared/headless/FileUploader/FileUploader';

type DropzoneProps = { openFileDialog?: () => void } & React.HTMLAttributes<HTMLDivElement>;

export const Image = ({ openFileDialog }: DropzoneProps) => (
    <FileUploader.Dropzone mode={{ kind: 'image', accept: 'image/*', multiple: false }}>
        {({ open }) => <DropzoneRenderer openFileDialog={open} />}
    </FileUploader.Dropzone>
);

const DropzoneRenderer = ({ openFileDialog }: DropzoneProps) => {
    const { dragging } = useFileUploader();

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
                    // onClick={openFileDialog}
                >
                    파일 선택
                </BaseButton>
            </div>
            {/* <p className={styles.HelperText}>jpg, png, gif 파일만 등록할 수 있습니다.</p> */}
        </div>
    );
};
