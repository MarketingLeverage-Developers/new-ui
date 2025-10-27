import React, { useEffect, useRef, useState, type ChangeEvent } from 'react';
import styles from './ProfileImageUploader.module.scss';
import { IoMdCamera } from 'react-icons/io';
import type { ImageItem, ImageItemInput } from '@/shared/headless/ImageUploader/ImageUploader';

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
            } catch (e) {
                //
            }
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

        // 언컨트롤드일 때는 내부 상태 갱신, 컨트롤드일 때는 부모가 value를 바꿀 것
        if (!isControlled) setInternalItems(nextListPreview);
        // 항상 부모 onChange 통지 (언/컨트롤드 공통)
        onChange?.(nextListPreview);

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

                    // 언컨트롤드 시 내부 상태 갱신
                    if (!isControlled) setInternalItems(nextListServer);
                    // 항상 부모 onChange 통지 (언/컨트롤드 공통)
                    onChange?.(nextListServer);
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
                    </div>
                ) : (
                    <div className={styles.Placeholder}>이미지 없음</div>
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
