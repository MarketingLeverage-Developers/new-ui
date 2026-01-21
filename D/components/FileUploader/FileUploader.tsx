// src/shared/primitives/D/components/FileUploader/FileUploader.tsx

import React, { createContext, useContext, useId, useMemo, useRef, useState, type ReactNode } from 'react';

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

import type { BaseStackedFileUploaderExtraProps } from './components/BaseStackedFileUploader/BaseStackedFileUploader';

/**
 * ✅ 핵심: "중복 타입 정의"를 없애고, 프로젝트 공용 모델 타입을 그대로 재사용한다.
 * - 여기서 ServerFile.fileType이 string 이었던 게 충돌 원인
 * - 공용 타입(FileType, ServerImage, ServerFile)을 한 군데서만 정의하고 import해서 쓴다
 */
import type { FileType, ServerFile, ServerImage } from '@/shared/types/common/model';

export type FileUploaderVariant = 'base' | 'input' | 'base-stacked' | 'base-alter';
export type FileUploaderType = 'image' | 'file';

export type FileUploaderValueByType = {
    image: ServerImage[];
    file: ServerFile[];
};

export type FileUploaderValue<T extends FileUploaderType> = FileUploaderValueByType[T];

export type FileUploaderUploader<T extends FileUploaderType> = (params: {
    type: T;
    files: File[];
}) => Promise<FileUploaderValue<T>>;

export type FileUploaderCommonBaseProps = {
    disabled?: boolean;
    multiple?: boolean;
    accept?: string;

    maxCount?: number;
    maxFileSizeMB?: number;

    showRemove?: boolean;

    children: ReactNode;
};

export type FileUploaderImageProps = FileUploaderCommonBaseProps & {
    type: 'image';
    value?: ServerImage[];
    onChange?: (next: ServerImage[]) => void;
    uploader?: FileUploaderUploader<'image'>;
};

export type FileUploaderFileProps = FileUploaderCommonBaseProps & {
    type: 'file';
    value?: ServerFile[];
    onChange?: (next: ServerFile[]) => void;
    uploader?: FileUploaderUploader<'file'>;
};

export type FileUploaderCommonProps = FileUploaderImageProps | FileUploaderFileProps;

export type FileUploaderProps =
    | ({ variant: 'base' } & FileUploaderCommonProps & BaseFileUploaderExtraProps)
    | ({ variant: 'input' } & FileUploaderCommonProps & BaseFileUploaderExtraProps)
    | ({ variant: 'base-stacked' } & FileUploaderCommonProps &
          BaseFileUploaderExtraProps &
          BaseStackedFileUploaderExtraProps)
    | ({ variant: 'base-alter' } & FileUploaderCommonProps & BaseFileUploaderExtraProps);

export type FileUploaderContextValue = {
    type: FileUploaderType;

    disabled: boolean;
    accept?: string;
    multiple: boolean;

    serverItems: ServerImage[] | ServerFile[];

    showRemove: boolean;

    stackedListView?: BaseStackedFileUploaderExtraProps['stackedListView'];

    inputId: string;
    inputRef: React.RefObject<HTMLInputElement | null>;

    openFileDialog: () => void;

    addFiles: (picked: File[]) => void;

    removeItem: (key: string) => void;

    getItemKey: (item: ServerImage | ServerFile) => string;

    maxCount: number;
    maxFileSizeMB: number;

    isUploading: boolean;
};

const FileUploaderContext = createContext<FileUploaderContextValue | null>(null);

export const useFileUploader = () => {
    const ctx = useContext(FileUploaderContext);
    if (!ctx) throw new Error("FileUploader.* must be used inside <FileUploader variant='...' ...>");
    return ctx;
};

type FileUploaderVariantContextValue = { variant: FileUploaderVariant };

const FileUploaderVariantContext = createContext<FileUploaderVariantContextValue | null>(null);

const useFileUploaderVariant = () => {
    const ctx = useContext(FileUploaderVariantContext);
    if (!ctx) throw new Error("FileUploader.* must be used inside <FileUploader variant='...' ...>");
    return ctx;
};

type FileUploaderCompound = React.FC<FileUploaderProps> & {
    Dropzone: React.FC<
        | BaseFileUploaderDropzoneProps
        | InputFileUploaderProps
        | BaseStackedFileUploaderDropzoneProps
        | BaseAlterFileUploaderDropzoneProps
    >;
    List: React.FC;
};

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
        uploader,
        showRemove = true,
        children,
        className,
    } = props;

    const stackedListView =
        variant === 'base-stacked'
            ? (props as { stackedListView?: BaseStackedFileUploaderExtraProps['stackedListView'] }).stackedListView
            : undefined;

    const inputId = useId();
    const inputRef = useRef<HTMLInputElement | null>(null);

    const isControlled = Array.isArray(value);

    const [innerValue, setInnerValue] = useState<ServerImage[] | ServerFile[]>(() =>
        type === 'image' ? ([] as ServerImage[]) : ([] as ServerFile[])
    );

    const serverItems: ServerImage[] | ServerFile[] = isControlled ? (value as any) : innerValue;

    const [isUploading, setIsUploading] = useState(false);

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

    const isOverSize = (file: File) => {
        const maxBytes = resolvedMaxFileSizeMB * 1024 * 1024;
        return file.size > maxBytes;
    };

    const getItemKey = (item: ServerImage | ServerFile) => {
        if ('imageUUID' in item) return `img_${item.imageUUID}`;
        return `file_${item.fileUUID}`;
    };

    const commit = (next: ServerImage[] | ServerFile[]) => {
        if (!isControlled) setInnerValue(next);
        onChange?.(next as any);
    };

    const makeServerImageFromLocalFile = (file: File): ServerImage => {
        const tempUUID = `tmp_${file.name}_${file.size}_${file.lastModified}`;
        const url = URL.createObjectURL(file);

        return {
            imageUUID: tempUUID,
            imageName: file.name,
            imageUrl: url,
        };
    };

    const makeServerFileFromLocalFile = (file: File): ServerFile => {
        const tempUUID = `tmp_${file.name}_${file.size}_${file.lastModified}`;
        const url = URL.createObjectURL(file);

        return {
            fileUUID: tempUUID,
            originalFileName: file.name,
            storedFileName: file.name,
            filePath: url,
            fileType: (file.type || 'application/octet-stream') as unknown as FileType,
        };
    };

    const mergeAndClamp = (current: any[], incoming: any[]) => {
        const merged = resolvedMultiple ? [...current, ...incoming] : incoming.slice(-1);
        return merged.slice(0, resolvedMaxCount);
    };

    const addFiles = async (picked: File[]) => {
        if (disabled) return;

        const filtered = picked.filter((f) => !isOverSize(f));
        if (filtered.length === 0) return;

        if (uploader) {
            try {
                setIsUploading(true);

                if (type === 'image') {
                    const uploaded = await (uploader as FileUploaderUploader<'image'>)({
                        type: 'image',
                        files: filtered,
                    });
                    const next = mergeAndClamp(serverItems as ServerImage[], uploaded as ServerImage[]);
                    commit(next);
                    return;
                }

                const uploaded = await (uploader as FileUploaderUploader<'file'>)({ type: 'file', files: filtered });
                const next = mergeAndClamp(serverItems as ServerFile[], uploaded as ServerFile[]);
                commit(next);
                return;
            } finally {
                setIsUploading(false);
            }
        }

        if (type === 'image') {
            const current = (serverItems as ServerImage[]) ?? [];
            const mapped = filtered.map(makeServerImageFromLocalFile);
            const next = mergeAndClamp(current, mapped);
            commit(next);
            return;
        }

        const current = (serverItems as ServerFile[]) ?? [];
        const mapped = filtered.map(makeServerFileFromLocalFile);
        const next = mergeAndClamp(current, mapped);
        commit(next);
    };

    const removeItem = (key: string) => {
        if (type === 'image') {
            const current = (serverItems as ServerImage[]) ?? [];
            const next = current.filter((it) => getItemKey(it) !== key);
            commit(next);
            return;
        }

        const current = (serverItems as ServerFile[]) ?? [];
        const next = current.filter((it) => getItemKey(it) !== key);
        commit(next);
    };

    const openFileDialog = () => {
        if (disabled || isUploading) return;
        inputRef.current?.click();
    };

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
            serverItems,
            showRemove,
            stackedListView,
            inputId,
            inputRef,
            openFileDialog,
            addFiles,
            removeItem,
            getItemKey,
            maxCount: resolvedMaxCount,
            maxFileSizeMB: resolvedMaxFileSizeMB,
            isUploading,
        }),
        [
            type,
            disabled,
            resolvedAccept,
            resolvedMultiple,
            serverItems,
            showRemove,
            stackedListView,
            inputId,
            resolvedMaxCount,
            resolvedMaxFileSizeMB,
            isUploading,
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

const FileUploaderDropzone: FileUploaderCompound['Dropzone'] = (props) => {
    const { variant } = useFileUploaderVariant();

    if (variant === 'input') return <InputFileUploader {...(props as InputFileUploaderProps)} />;
    if (variant === 'base-stacked')
        return <BaseStackedFileUploaderDropzone {...(props as BaseStackedFileUploaderDropzoneProps)} />;
    if (variant === 'base-alter')
        return <BaseAlterFileUploaderDropzone {...(props as BaseAlterFileUploaderDropzoneProps)} />;

    return <BaseFileUploaderDropzone {...(props as BaseFileUploaderDropzoneProps)} />;
};

const FileUploaderList: React.FC = () => {
    const { variant } = useFileUploaderVariant();

    if (variant === 'input') return null;
    if (variant === 'base-alter') return null;

    if (variant === 'base-stacked') return <BaseStackedFileUploaderList />;

    return <BaseFileUploaderList />;
};

const FileUploader = Object.assign(FileUploaderRoot, {
    Dropzone: FileUploaderDropzone,
    List: FileUploaderList,
}) as FileUploaderCompound;

export default FileUploader;
