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

import type { BaseStackedFileUploaderExtraProps } from './components/BaseStackedFileUploader/BaseStackedFileUploader';

export type FileUploaderVariant = 'base' | 'input' | 'base-stacked' | 'base-alter';
export type FileUploaderType = 'image' | 'file';

/** ✅ 서버에서 내려오는 "기존 파일 링크" 모델 */
export type FileUploaderDefaultUrl = string;

export type FileUploaderCommonProps = {
    type: FileUploaderType;

    disabled?: boolean;
    multiple?: boolean;
    accept?: string;

    maxCount?: number;
    maxFileSizeMB?: number;

    /** ✅ 새로 선택한 파일들 (기존 방식 그대로) */
    value?: File[];
    onChange?: (files: File[]) => void;

    /** ✅ 기존(서버) 파일 링크들 */
    defaultUrls?: FileUploaderDefaultUrl[];
    onDefaultUrlsChange?: (next: FileUploaderDefaultUrl[]) => void;

    /** ✅ List에서 삭제 버튼 표시 여부 (상세에서 false로 사용) */
    showRemove?: boolean;

    children: ReactNode;
};

export type FileUploaderProps =
    | ({ variant: 'base' } & FileUploaderCommonProps & BaseFileUploaderExtraProps)
    | ({ variant: 'input' } & FileUploaderCommonProps & BaseFileUploaderExtraProps)
    | ({ variant: 'base-stacked' } & FileUploaderCommonProps &
          BaseFileUploaderExtraProps &
          BaseStackedFileUploaderExtraProps)
    | ({ variant: 'base-alter' } & FileUploaderCommonProps & BaseFileUploaderExtraProps);

/** 1) 공통 기능 Context */
export type FileUploaderContextValue = {
    type: FileUploaderType;

    disabled: boolean;
    accept?: string;
    multiple: boolean;

    /** ✅ 새 파일들 */
    files: File[];

    /** ✅ 기존(서버) 파일 링크들 */
    defaultUrls: FileUploaderDefaultUrl[];
    removeDefaultUrl: (url: FileUploaderDefaultUrl) => void;

    /** ✅ 삭제 버튼 표시 여부 */
    showRemove: boolean;

    /** ✅ base-stacked 전용 옵션 (BaseStackedFileUploaderList에서만 사용) */
    stackedListView?: BaseStackedFileUploaderExtraProps['stackedListView'];

    inputId: string;
    inputRef: React.RefObject<HTMLInputElement | null>;

    openFileDialog: () => void;
    addFiles: (picked: File[]) => void;
    removeFile: (key: string) => void;

    getFileKey: (file: File) => string;

    maxCount: number;
    maxFileSizeMB: number;

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

        defaultUrls,
        onDefaultUrlsChange,

        showRemove = true,

        children,
        className,
    } = props;

    /** ✅ base-stacked 전용 옵션은 base-stacked일 때만 읽기 */
    const stackedListView =
        variant === 'base-stacked'
            ? (props as { stackedListView?: BaseStackedFileUploaderExtraProps['stackedListView'] }).stackedListView
            : undefined;

    const inputId = useId();
    const inputRef = useRef<HTMLInputElement | null>(null);

    /** ✅ 기존 링크는 "컨트롤드/언컨트롤드" 둘 다 지원 */
    const isDefaultUrlsControlled = Array.isArray(defaultUrls);
    const [innerDefaultUrls, setInnerDefaultUrls] = useState<FileUploaderDefaultUrl[]>([]);
    const resolvedDefaultUrls = isDefaultUrlsControlled ? (defaultUrls as FileUploaderDefaultUrl[]) : innerDefaultUrls;

    const commitDefaultUrls = useCallback(
        (next: FileUploaderDefaultUrl[]) => {
            if (!isDefaultUrlsControlled) setInnerDefaultUrls(next);
            onDefaultUrlsChange?.(next);
        },
        [isDefaultUrlsControlled, onDefaultUrlsChange]
    );

    const removeDefaultUrl = useCallback(
        (url: FileUploaderDefaultUrl) => {
            const next = resolvedDefaultUrls.filter((u) => u !== url);
            commitDefaultUrls(next);
        },
        [commitDefaultUrls, resolvedDefaultUrls]
    );

    /** ✅ 기존 파일(value File[])은 기존대로 */
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

            if (type === 'file') {
                const merged = resolvedMultiple ? [...files, ...filtered] : filtered.slice(-1);
                const next = merged.slice(0, resolvedMaxCount);
                commit(next);
                return;
            }

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

            defaultUrls: resolvedDefaultUrls,
            removeDefaultUrl,

            showRemove,

            stackedListView,

            inputId,
            inputRef,
            openFileDialog,
            addFiles,
            removeFile,
            getFileKey,
            maxCount: resolvedMaxCount,
            maxFileSizeMB: resolvedMaxFileSizeMB,

            notifyChange: onChange,
        }),
        [
            type,
            disabled,
            resolvedAccept,
            resolvedMultiple,
            files,
            resolvedDefaultUrls,
            removeDefaultUrl,
            showRemove,
            stackedListView,
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
