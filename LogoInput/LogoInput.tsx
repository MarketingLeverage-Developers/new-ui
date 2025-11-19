import React, { useRef, useState, type InputHTMLAttributes } from 'react';
import styles from './LogoInput.module.scss';
import { IoMdCloseCircle } from 'react-icons/io';

type Props = InputHTMLAttributes<HTMLInputElement>;

const LogoInput = ({ ...props }: Props) => {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleClick = () => {
        fileRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
        }
        props.onChange?.(e);
    };

    const handleDelete = () => {
        setFileName(null);
        if (fileRef.current) {
            fileRef.current.value = '';
        }
        props.onChange?.({
            target: { value: '' },
        } as any);
    };

    return (
        <div className={styles.LogoInputWrapper}>
            {/* 입력 영역 */}
            <div className={styles.LogoInput}>
                <span className={styles.Placeholder}>{fileName || '로고 파일을 첨부해주세요'}</span>

                <button className={styles.UploadButton} type="button" onClick={handleClick}>
                    파일첨부
                </button>

                <input
                    type="file"
                    ref={fileRef}
                    className={styles.Input}
                    accept=".png, .jpg, .jpeg, .psd, .ai, .svg"
                    onChange={handleChange}
                    {...props}
                />
            </div>

            {/* 안내 문구 */}
            <span className={styles.HelperText}>
                원본(일러스트 또는 포토샵 파일)이 가장 좋으나, 없을 시 jpg/png로 전달해 주세요
            </span>

            {/* 파일 리스트 */}
            {fileName && (
                <div className={styles.FileItem}>
                    <span className={styles.FileName}>{fileName}</span>
                    <IoMdCloseCircle className={styles.DeleteBtn} onClick={handleDelete} />
                </div>
            )}
        </div>
    );
};

export default LogoInput;
