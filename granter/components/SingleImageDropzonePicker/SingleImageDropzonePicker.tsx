import { useRef, useState, type DragEventHandler } from 'react';
import { FiX } from 'react-icons/fi';

export type SingleImageDropzonePickerProps = {
    imageSrc?: string | null;
    imageAlt?: string;
    placeholder?: string;
    accept?: string;
    disabled?: boolean;
    className?: string;
    buttonClassName?: string;
    removeButtonClassName?: string;
    removeAriaLabel?: string;
    onFiles: (files: FileList) => void | Promise<void>;
    onClear?: () => void;
};

const SingleImageDropzonePicker = ({
    imageSrc,
    imageAlt = '선택된 이미지',
    placeholder = '이미지 첨부하기',
    accept = 'image/*',
    disabled = false,
    className,
    buttonClassName,
    removeButtonClassName,
    removeAriaLabel = '이미지 제거',
    onFiles,
    onClear,
}: SingleImageDropzonePickerProps) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [dragging, setDragging] = useState(false);

    const openFileDialog = () => {
        if (disabled) return;
        inputRef.current?.click();
    };

    const commitFiles = async (files: FileList | null) => {
        if (disabled || !files?.length) return;

        try {
            await onFiles(files);
        } finally {
            if (inputRef.current) inputRef.current.value = '';
        }
    };

    const handleDragEnter: DragEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (disabled) return;
        setDragging(true);
    };

    const handleDragOver: DragEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (disabled) return;
        setDragging(true);
    };

    const handleDragLeave: DragEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault();
        event.stopPropagation();

        const nextTarget = event.relatedTarget;
        if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) return;
        setDragging(false);
    };

    const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);

        if (disabled) return;
        void commitFiles(event.dataTransfer.files);
    };

    return (
        <div
            className={className}
            data-dragging={dragging ? 'true' : 'false'}
            data-disabled={disabled ? 'true' : 'false'}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <button
                type="button"
                className={buttonClassName}
                disabled={disabled}
                data-dragging={dragging ? 'true' : 'false'}
                data-disabled={disabled ? 'true' : 'false'}
                onClick={openFileDialog}
            >
                {imageSrc ? <img src={imageSrc} alt={imageAlt} /> : <span>{placeholder}</span>}
            </button>
            {imageSrc && onClear ? (
                <button
                    type="button"
                    className={removeButtonClassName}
                    disabled={disabled}
                    aria-label={removeAriaLabel}
                    onClick={onClear}
                >
                    <FiX size={16} />
                </button>
            ) : null}
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                hidden
                disabled={disabled}
                onChange={(event) => {
                    void commitFiles(event.target.files);
                }}
            />
        </div>
    );
};

export default SingleImageDropzonePicker;
