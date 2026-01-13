import type React from 'react';
import { useEffect, useMemo, useRef, useState, type InputHTMLAttributes } from 'react';
import styles from './RoundedFileInput.module.scss';
import classNames from 'classnames';
import { STATUS, type Status } from '@/shared/types/css/Status';

type ResolvedFile = {
    id: string; // 서버 uuid 같은 최종 값
    url?: string; // 필요하면 저장해도 됨(현재 UI는 파일명만 쓰므로 옵션)
    name?: string; // 서버가 리턴하는 원본 파일명 등
};

type RoundedFileInputProps = {
    wrapperStyle?: React.CSSProperties;
    status?: Status;
    helperText?: React.ReactNode;
    placeholder?: string;
    buttonText?: string;

    /** 파일 선택 직후 File 그대로 필요하면 */
    onFileChange?: (file: File | null) => void;

    /** 서버 업로드/리졸브 (있으면 성공 시 id로 value 교체) */
    onResolveFiles?: (files: File[]) => Promise<ResolvedFile[]>;

    /** 최종 값(uuid/blob 등)을 부모로 올림 (useZodForm.register.onChange를 여기에 연결) */
    onValueChange?: (value: string) => void;

    /** 외부에서 이미 값이 있는 경우(예: 수정 화면) 파일명 표시용 */
    valueLabel?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'>;

const RoundedFileInput: React.FC<RoundedFileInputProps> = ({
    wrapperStyle,
    className,
    status = STATUS.DEFAULT,
    helperText,
    placeholder = '파일을 첨부해주세요',
    buttonText = '파일첨부',
    onFileChange,
    onResolveFiles,
    onValueChange,
    valueLabel,
    disabled,
    accept,
    ...inputProps
}) => {
    const [fileName, setFileName] = useState<string | null>(null);
    const [touched, setTouched] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    // blob url을 fallback으로 만들 때 revoke
    const ownedObjectUrlRef = useRef<string | null>(null);

    const revokeOwned = () => {
        if (!ownedObjectUrlRef.current) return;
        try {
            URL.revokeObjectURL(ownedObjectUrlRef.current);
        } catch {
            //
        }
        ownedObjectUrlRef.current = null;
    };

    useEffect(() => () => revokeOwned(), []);

    // 외부 label이 있으면 초기 표시로 사용(수정 화면 등)
    useEffect(() => {
        if (!touched && valueLabel) {
            setFileName(valueLabel);
        }
    }, [valueLabel, touched]);

    const filled = !!fileName;
    const showFeedback = touched || filled;

    const cn = useMemo(
        () =>
            classNames(styles.RoundedFileInput, className, {
                [styles.Error]: showFeedback && status === STATUS.ERROR,
                [styles.Success]: showFeedback && status === STATUS.SUCCESS,
                [styles.Disabled]: disabled || isUploading,
            }),
        [className, showFeedback, status, disabled, isUploading]
    );

    const handleClick = () => {
        if (disabled || isUploading) return;
        inputRef.current?.click();
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const el = e.currentTarget;
        const file = el.files?.[0] || null;

        // 같은 파일 재선택 가능하도록 초기화
        el.value = '';

        setTouched(true);
        setFileName(file?.name || null);
        onFileChange?.(file);

        if (!file) {
            revokeOwned();
            onValueChange?.('');
            return;
        }

        // 1) 서버 업로드가 있으면: 성공 시 uuid로 교체
        if (onResolveFiles) {
            setIsUploading(true);
            try {
                const resolved = await onResolveFiles([file]);
                const first = resolved?.[0];

                if (first?.id) {
                    // 표시 파일명은 서버에서 주면 그걸로(없으면 원래 파일명)
                    setFileName(first.name ?? file.name ?? null);
                    revokeOwned(); // 혹시 fallback 만들었을 경우 정리
                    onValueChange?.(first.id);
                    return;
                }

                // 서버가 비어있으면 fallback로 내려감
            } catch {
                // 실패 시 fallback로 내려감
            } finally {
                setIsUploading(false);
            }
        }

        // 2) 서버 업로드가 없거나 실패한 경우: blob url을 value로 사용 (필요 없으면 여기 제거해도 됨)
        revokeOwned();
        const previewUrl = URL.createObjectURL(file);
        ownedObjectUrlRef.current = previewUrl;
        onValueChange?.(previewUrl);
    };

    return (
        <div className={cn} style={{ ...wrapperStyle }}>
            <input
                ref={inputRef}
                type="file"
                onChange={handleChange}
                disabled={disabled || isUploading}
                accept={accept}
                {...inputProps}
            />

            <span className={styles.Placeholder}>
                {fileName || placeholder}
                {isUploading ? ' (업로드 중)' : ''}
            </span>

            <button type="button" className={styles.Button} onClick={handleClick} disabled={disabled || isUploading}>
                {buttonText}
            </button>

            {showFeedback && status !== STATUS.DEFAULT && helperText && (
                <span className={styles.Helper}>{helperText}</span>
            )}
        </div>
    );
};

export default RoundedFileInput;
