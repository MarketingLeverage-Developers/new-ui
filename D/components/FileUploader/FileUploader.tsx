import React, { createContext, useCallback, useContext, useId, useMemo, useRef, useState, type ReactNode } from 'react';

import BaseFileUploader, { type BaseFileUploaderExtraProps } from './components/BaseFileUploader/BaseFileUploader';

import BaseFileUploaderDropzone, {
    type BaseFileUploaderDropzoneProps,
} from './components/BaseFileUploader/components/BaseFileUploaderDropzone/BaseFileUploaderDropzone';

import BaseFileUploaderList from './components/BaseFileUploader/components/BaseFileUploaderList/BaseFileUploaderList';

import InputFileUploader, { type InputFileUploaderProps } from './components/InputFileUploader/InputFileUploader';

import type { BaseStackedFileUploaderDropzoneProps } from './components/BaseStackedFileUploader/components/BaseStackedFileUploaderDropzone/BaseStackedFileUploaderDropzone';
import BaseStackedFileUploaderDropzone from './components/BaseStackedFileUploader/components/BaseStackedFileUploaderDropzone/BaseStackedFileUploaderDropzone';
import BaseStackedFileUploaderList from './components/BaseStackedFileUploader/components/BaseStackedFileUploaderList/BaseStackedFileUploaderList';

import BaseAlterFileUploader from './components/BaseAlterFileUploader/BaseAlterFileUploader';
import BaseAlterFileUploaderDropzone, {
    type BaseAlterFileUploaderDropzoneProps,
} from './components/BaseAlterFileUploader/components/BaseAlterFileUploaderDropzone/BaseAlterFileUploaderDropzone';

export type FileUploaderVariant = 'base' | 'input' | 'base-stacked' | 'base-alter';
export type FileUploaderType = 'image' | 'file';

export type FileUploaderCommonProps = {
    type: FileUploaderType;

    disabled?: boolean;
    multiple?: boolean;
    accept?: string;

    maxCount?: number;
    maxFileSizeMB?: number;

    value?: File[];
    onChange?: (files: File[]) => void;

    children: ReactNode;
};

export type FileUploaderProps =
    | ({ variant: 'base' } & FileUploaderCommonProps & BaseFileUploaderExtraProps)
    | ({ variant: 'input' } & FileUploaderCommonProps & BaseFileUploaderExtraProps)
    | ({ variant: 'base-stacked' } & FileUploaderCommonProps & BaseFileUploaderExtraProps)
    | ({ variant: 'base-alter' } & FileUploaderCommonProps & BaseFileUploaderExtraProps);

/** 1) 공통 기능 Context */
export type FileUploaderContextValue = {
    type: FileUploaderType;

    disabled: boolean;
    accept?: string;
    multiple: boolean;

    files: File[];

    inputId: string;
    inputRef: React.RefObject<HTMLInputElement | null>;

    openFileDialog: () => void;
    addFiles: (picked: File[]) => void;
    removeFile: (key: string) => void;

    getFileKey: (file: File) => string;

    maxCount: number;
    maxFileSizeMB: number;

    /** ✅ Dropzone에서 바로 받고 싶을 때 */
    notifyChange?: (files: File[]) => void;
};

const FileUploaderContext = createContext<FileUploaderContextValue | null>(null);

export const useFileUploader = () => {
    const ctx = useContext(FileUploaderContext);
    if (!ctx) {
        throw new Error("FileUploader.* must be used inside <FileUploader variant='...' ...>");
    }
    return ctx;
};

/** 2) variant 공유 Context */
type FileUploaderVariantContextValue = {
    variant: FileUploaderVariant;
};

const FileUploaderVariantContext = createContext<FileUploaderVariantContextValue | null>(null);

const useFileUploaderVariant = () => {
    const ctx = useContext(FileUploaderVariantContext);
    if (!ctx) {
        throw new Error("FileUploader.* must be used inside <FileUploader variant='...' ...>");
    }
    return ctx;
};

/** 3) 합성 컴포넌트 타입 */
type FileUploaderCompound = React.FC<FileUploaderProps> & {
    Dropzone: React.FC<
        | BaseFileUploaderDropzoneProps
        | InputFileUploaderProps
        | BaseStackedFileUploaderDropzoneProps
        | BaseAlterFileUploaderDropzoneProps
    >;
    List: React.FC;
};

/** 4) Root */
const FileUploaderRoot: React.FC<FileUploaderProps> = (props) => {
    const {
        variant,
        type,
        disabled = false,
        multiple,
        accept,
        maxCount,
        maxFileSizeMB,
        value,
        onChange,
        children,
        className,
    } = props;

    const inputId = useId();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const isControlled = Array.isArray(value);
    const [innerFiles, setInnerFiles] = useState<File[]>([]);
    const files = isControlled ? (value as File[]) : innerFiles;

    const resolvedMultiple = useMemo(() => {
        if (variant === 'base-alter') return false;
        return multiple ?? type === 'image';
    }, [multiple, type, variant]);

    const resolvedAccept = useMemo(() => {
        if (accept) return accept;
        if (type === 'image') return 'image/png,image/jpeg,image/gif';
        return undefined;
    }, [accept, type]);

    const resolvedMaxCount = useMemo(() => {
        if (variant === 'base-alter') return 1;
        return maxCount ?? (type === 'image' ? 5 : 5);
    }, [maxCount, type, variant]);

    const resolvedMaxFileSizeMB = useMemo(() => maxFileSizeMB ?? (type === 'file' ? 500 : 50), [maxFileSizeMB, type]);

    const getFileKey = useCallback((file: File) => `${file.name}_${file.size}_${file.lastModified}`, []);

    const commit = useCallback(
        (next: File[]) => {
            if (isControlled) {
                onChange?.(next);
                return;
            }
            setInnerFiles(next);
            onChange?.(next);
        },
        [isControlled, onChange]
    );

    const isOverSize = useCallback(
        (file: File) => {
            const maxBytes = resolvedMaxFileSizeMB * 1024 * 1024;
            return file.size > maxBytes;
        },
        [resolvedMaxFileSizeMB]
    );

    const addFiles = useCallback(
        (picked: File[]) => {
            if (disabled) return;

            const filtered = picked.filter((f) => !isOverSize(f));
            if (filtered.length === 0) return;

            // ✅ file 타입: multiple일 수 있으니 maxCount 기준으로 누적
            if (type === 'file') {
                const merged = resolvedMultiple ? [...files, ...filtered] : filtered.slice(-1);
                const next = merged.slice(0, resolvedMaxCount);
                commit(next);
                return;
            }

            // ✅ image 타입
            const merged = [...files, ...filtered];

            if (resolvedMaxCount === 1) {
                commit(merged.slice(-1));
                return;
            }

            commit(merged.slice(0, resolvedMaxCount));
        },
        [commit, disabled, files, isOverSize, resolvedMaxCount, resolvedMultiple, type]
    );

    const removeFile = useCallback(
        (key: string) => {
            commit(files.filter((f) => getFileKey(f) !== key));
        },
        [commit, files, getFileKey]
    );

    const openFileDialog = useCallback(() => {
        if (disabled) return;
        inputRef.current?.click();
    }, [disabled]);

    const Frame = useMemo(() => {
        if (variant === 'base-alter') return BaseAlterFileUploader;
        return BaseFileUploader;
    }, [variant]);

    const uploaderCtx: FileUploaderContextValue = useMemo(
        () => ({
            type,
            disabled,
            accept: resolvedAccept,
            multiple: resolvedMultiple,
            files,
            inputId,
            inputRef,
            openFileDialog,
            addFiles,
            removeFile,
            getFileKey,
            maxCount: resolvedMaxCount,
            maxFileSizeMB: resolvedMaxFileSizeMB,

            /** ✅ Dropzone에서 쓰고 싶으면 Root onChange 그대로 제공 */
            notifyChange: onChange,
        }),
        [
            type,
            disabled,
            resolvedAccept,
            resolvedMultiple,
            files,
            inputId,
            openFileDialog,
            addFiles,
            removeFile,
            getFileKey,
            resolvedMaxCount,
            resolvedMaxFileSizeMB,
            onChange,
        ]
    );

    return (
        <FileUploaderVariantContext.Provider value={{ variant }}>
            <FileUploaderContext.Provider value={uploaderCtx}>
                <Frame className={className}>{children}</Frame>
            </FileUploaderContext.Provider>
        </FileUploaderVariantContext.Provider>
    );
};

/** 5) Dropzone 분기 */
const FileUploaderDropzone: FileUploaderCompound['Dropzone'] = (props) => {
    const { variant } = useFileUploaderVariant();

    if (variant === 'input') {
        return <InputFileUploader {...(props as InputFileUploaderProps)} />;
    }

    if (variant === 'base-stacked') {
        return <BaseStackedFileUploaderDropzone {...(props as BaseStackedFileUploaderDropzoneProps)} />;
    }

    if (variant === 'base-alter') {
        return <BaseAlterFileUploaderDropzone {...(props as BaseAlterFileUploaderDropzoneProps)} />;
    }

    return <BaseFileUploaderDropzone {...(props as BaseFileUploaderDropzoneProps)} />;
};

/** 6) List */
const FileUploaderList: React.FC = () => {
    const { variant } = useFileUploaderVariant();

    if (variant === 'input') return null;
    if (variant === 'base-alter') return null;

    if (variant === 'base-stacked') {
        return <BaseStackedFileUploaderList />;
    }

    return <BaseFileUploaderList />;
};

const FileUploader = Object.assign(FileUploaderRoot, {
    Dropzone: FileUploaderDropzone,
    List: FileUploaderList,
}) as FileUploaderCompound;

export default FileUploader;
