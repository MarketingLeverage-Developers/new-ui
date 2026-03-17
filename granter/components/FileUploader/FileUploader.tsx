import React from 'react';
import classNames from 'classnames';
import { FiImage, FiX } from 'react-icons/fi';
import ImageUploader, {
    type ImageItem,
    type ImageItemInput,
    useImageUploader,
} from '@/shared/headless/ImageUploader/ImageUploader';
import styles from './FileUploader.module.scss';

type LegacyImageItem = {
    imageUUID: string;
    imageUrl: string;
    imageName: string;
};

export type FileUploaderProps = {
    children: React.ReactNode;
    value?: ImageItemInput[] | LegacyImageItem[];
    onChange?: (next: ImageItem[] | LegacyImageItem[]) => void;
    uploader?: (args: { files: File[] }) => Promise<ImageItemInput[] | LegacyImageItem[]>;
} & Omit<React.ComponentProps<typeof ImageUploader>, 'value' | 'onChange' | 'onResolveFiles'>;

export type FileUploaderDropzoneProps = {
    buttonText?: string;
    guideText?: string;
    helperText?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export type FileUploaderFileListProps = React.HTMLAttributes<HTMLDivElement>;
export type FileUploaderImageListProps = React.HTMLAttributes<HTMLDivElement>;

const isLegacyImageItem = (item: ImageItemInput | LegacyImageItem): item is LegacyImageItem =>
    typeof (item as LegacyImageItem).imageUUID === 'string';

const toHeadlessValue = (items: Array<ImageItemInput | LegacyImageItem> = []): ImageItemInput[] =>
    items.map((item) =>
        isLegacyImageItem(item)
            ? {
                  id: item.imageUUID,
                  url: item.imageUrl,
                  name: item.imageName,
                  owned: false,
              }
            : item
    );

const toLegacyValue = (items: ImageItem[] = []): LegacyImageItem[] =>
    items.map((item) => ({
        imageUUID: item.id,
        imageUrl: item.url,
        imageName: item.name ?? '',
    }));

const FileUploaderRoot = ({
    children,
    className,
    value,
    onChange,
    uploader,
    onResolveFiles,
    ...props
}: FileUploaderProps) => {
    const usesLegacyShape = Boolean(uploader) || Boolean(value?.some(isLegacyImageItem));

    return (
        <ImageUploader
            {...props}
            value={value ? toHeadlessValue(value) : undefined}
            onChange={(next) => {
                if (!onChange) return;
                onChange(usesLegacyShape ? toLegacyValue(next) : next);
            }}
            onResolveFiles={
                uploader
                    ? async (files) => {
                          const resolved = await uploader({ files });
                          return toHeadlessValue(resolved ?? []);
                      }
                    : onResolveFiles
            }
            className={classNames(styles.HeadlessRoot, className)}
        >
            <div className={styles.Root}>{children}</div>
        </ImageUploader>
    );
};

const FileUploaderDropzone = ({
    buttonText = '파일 선택',
    guideText,
    helperText = 'jpg, png, gif 파일만 등록할 수 있습니다.',
    className,
    ...props
}: FileUploaderDropzoneProps) => (
    <ImageUploader.Dropzone>
        {() => (
            <DropzoneRenderer
                className={className}
                buttonText={buttonText}
                guideText={guideText}
                helperText={helperText}
                {...props}
            />
        )}
    </ImageUploader.Dropzone>
);

const DropzoneRenderer = ({ buttonText, guideText, helperText, className, ...props }: FileUploaderDropzoneProps) => {
    const { dragging, openFileDialog } = useImageUploader();

    return (
        <div className={classNames(styles.DropzoneContainer, className)} {...props}>
            <div className={styles.Dropzone} data-dragging={dragging ? 'true' : 'false'}>
                <FiImage className={styles.DropzoneIcon} />
                <p>{dragging ? '여기에 놓으세요.' : (guideText ?? '파일을 드래그하여 업로드하세요.')}</p>
                <button type="button" className={styles.SelectButton} onClick={openFileDialog}>
                    {buttonText}
                </button>
            </div>
            <p className={styles.HelperText}>{helperText}</p>
        </div>
    );
};

const FileUploaderFileList = ({ className, ...props }: FileUploaderFileListProps) => (
    <ImageUploader.FileList
        {...props}
        className={classNames(styles.FileList, className)}
        renderItem={(item, _index, actions) => (
            <div className={styles.FileItem}>
                <div className={styles.FileMeta}>
                    <span className={styles.FileName}>{item.name || item.url}</span>
                </div>
                <button
                    type="button"
                    className={styles.RemoveButton}
                    aria-label="파일 제거"
                    onClick={actions.remove}
                >
                    <FiX />
                </button>
            </div>
        )}
    />
);

const FileUploaderImageList = ({ className, ...props }: FileUploaderImageListProps) => (
    <ImageUploader.ImageList
        {...props}
        className={classNames(styles.ImageList, className)}
        renderItem={(item, _index, actions) => (
            <div className={styles.ImageItem}>
                <div className={styles.ImagePreview}>
                    <img src={item.url} alt={item.name || '이미지 미리보기'} />
                    <button
                        type="button"
                        className={styles.ImageRemoveButton}
                        aria-label="이미지 제거"
                        onClick={actions.remove}
                    >
                        <FiX />
                    </button>
                </div>
                <span className={styles.ImageName}>{item.name || 'image'}</span>
            </div>
        )}
    />
);

type FileUploaderCompound = React.FC<FileUploaderProps> & {
    Dropzone: React.FC<FileUploaderDropzoneProps>;
    FileList: React.FC<FileUploaderFileListProps>;
    ImageList: React.FC<FileUploaderImageListProps>;
};

const FileUploader = Object.assign(FileUploaderRoot, {
    Dropzone: FileUploaderDropzone,
    FileList: FileUploaderFileList,
    ImageList: FileUploaderImageList,
}) as FileUploaderCompound;

export default FileUploader;
