import React, { useRef, useState } from 'react';
import styles from './ProfileImageUploader.module.scss';
import { IoMdCamera } from 'react-icons/io';

type ProfileImageUploaderProps = {
    url?: string; // controlled 모드: 외부 상태
    onChange?: (file: File) => void; // 파일 선택 시 부모로 알림
};

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({ url, onChange }) => {
    const isControlled = url !== undefined;
    const [internalUrl, setInternalUrl] = useState<string | undefined>(undefined); // uncontrolled용
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = ''; // 같은 파일 다시 선택 가능하도록 초기화

        if (!file) return;

        if (isControlled) {
            onChange?.(file);
        } else {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    setInternalUrl(reader.result);
                    onChange?.(file);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const src = isControlled ? url : internalUrl;

    return (
        <div className={styles.ProfileImageUploader}>
            <div className={styles.ImageWrapper} onClick={handleClick}>
                {src ? (
                    <img src={src} alt="profile" className={styles.Image} />
                ) : (
                    <div className={styles.Placeholder}>이미지 없음</div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.HiddenInput}
            />

            <button type="button" onClick={handleClick} className={styles.Button}>
                <IoMdCamera />
            </button>
        </div>
    );
};

export default ProfileImageUploader;
