import React, { useEffect, useRef, useState, type ChangeEvent } from 'react';
import styles from './ProfileImageUploader.module.scss';
import { IoMdCamera } from 'react-icons/io';
import type { ImageItem, ImageItemInput } from '@/shared/headless/ImageUploader/ImageUploader';
import EX_IMG from '@/shared/assets/images/profile-example.png';
import SampleProfile from '@/shared/assets/images/profile-example.png';

type ProfileImageUploaderProps = {
    value?: ImageItem[];
    onChange?: (next: ImageItem[] | ChangeEvent<Element>) => void;
    onResolveFiles?: (files: File[]) => Promise<ImageItemInput[]>;
    accept?: string;
    disabled?: boolean;
    maxSize?: number;
};

const normalize = (arr: ImageItemInput[], fileFallbackName?: string): ImageItemInput[] => {
    const used = new Set<string>();
    return arr.map((it, idx) => {
        const base = it.id ?? it.url ?? String(idx);
        let id = base,
            n = 1;
        while (used.has(id)) {
            n += 1;
            id = `${base}__${n}`;
        }
        used.add(id);
        return { id, url: it.url, name: it.name ?? fileFallbackName };
    });
};

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
    value,
    onChange,
    onResolveFiles,
    accept = 'image/*',
    disabled,
    maxSize,
}) => {
    const isControlled = value !== undefined;
    const [internalItems, setInternalItems] = useState<ImageItem[]>([]);

    const ownedObjectUrlRef = useRef<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const revokeOwned = () => {
        if (ownedObjectUrlRef.current) {
            try {
                URL.revokeObjectURL(ownedObjectUrlRef.current);
            } catch {}
            ownedObjectUrlRef.current = null;
        }
    };
    useEffect(() => () => revokeOwned(), []);

    const first = isControlled ? (value?.[0] as ImageItem | undefined) : internalItems[0];
    const src = first?.url;

    const handleClick = () => {
        if (!disabled) inputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const el = e.currentTarget;
        const file = el.files?.[0];
        el.value = '';
        if (!file) return;
        if (maxSize && file.size > maxSize) return;

        // 1) 즉시 로컬 미리보기(배열의 첫 요소 대체)
        const previewUrl = URL.createObjectURL(file);
        revokeOwned();
        ownedObjectUrlRef.current = previewUrl;

        const previewItem: ImageItem = { id: previewUrl, url: previewUrl, name: file.name, owned: true };
        const nextListPreview: ImageItem[] = [previewItem]; // 프로필은 단일만 유지

        if (isControlled) onChange?.(nextListPreview);
        else setInternalItems(nextListPreview);

        // 2) 서버 업로드 있으면 교체
        if (onResolveFiles) {
            try {
                const resolved = await onResolveFiles([file]); // ImageItemInput[]
                const normalized = normalize(resolved ?? [], file.name); // ImageItemInput[]
                const firstResolved = normalized[0];

                if (firstResolved?.url) {
                    revokeOwned(); // 로컬 미리보기 정리
                    const serverItem: ImageItem = {
                        id: firstResolved.id ?? firstResolved.url,
                        url: firstResolved.url,
                        name: firstResolved.name,
                        owned: false,
                    };
                    const nextListServer: ImageItem[] = [serverItem];

                    if (isControlled) onChange?.(nextListServer);
                    else setInternalItems(nextListServer);
                }
            } catch {
                // 실패 시 프리뷰 유지
            }
        }
    };

    return (
        <div className={styles.ProfileImageUploader} data-disabled={disabled ? 'true' : 'false'}>
            <div className={styles.ImageWrapper} onClick={handleClick} role="button" aria-disabled={disabled}>
                {src ? (
                    <div className={styles.Image}>
                        <img src={src} alt="이미지 업로드" />
                        {/* 실제 API 받을 때는 src 안에 src 로 바꾸면 된다 */}
                    </div>
                ) : (
                    // <img src={src} alt="profile" className={styles.Image} />
                    <div className={styles.Placeholder}>이미지 없음</div>
                    // <div className={styles.Placeholder}>
                    //     <img src={SampleProfile} alt="이미지 없음" />
                    // </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className={styles.HiddenInput}
                disabled={disabled}
            />

            <button
                type="button"
                onClick={handleClick}
                className={styles.Button}
                disabled={disabled}
                aria-label="이미지 선택"
            >
                <IoMdCamera />
            </button>
        </div>
    );
};

export default ProfileImageUploader;
