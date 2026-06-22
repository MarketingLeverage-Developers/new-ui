import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { FiDownload, FiEye, FiFile, FiMoreVertical, FiPackage, FiPlayCircle } from 'react-icons/fi';
import EmptyStatePanel from '../EmptyStatePanel/EmptyStatePanel';
import styles from './OutputAssetList.module.scss';

export type OutputAssetListKind = 'image' | 'video' | 'file';
export type OutputAssetListStatusTone = 'blue' | 'green' | 'gray';

export type OutputAssetListItem = {
    id: string | number;
    name: string;
    url?: string;
    mimeType?: string;
    kind?: OutputAssetListKind;
    materialLabel?: React.ReactNode;
    sizeText?: string;
    createdAtText?: string;
    statusLabel?: string;
    statusTone?: OutputAssetListStatusTone;
};

export type OutputAssetListProps = {
    items: OutputAssetListItem[];
    title?: React.ReactNode;
    description?: React.ReactNode;
    emptyText?: React.ReactNode;
    emptyDescription?: React.ReactNode;
    emptyIcon?: React.ReactNode;
    className?: string;
    variant?: 'card' | 'table';
    showHeader?: boolean;
    showFilters?: boolean;
    showSort?: boolean;
    onPreview?: (item: OutputAssetListItem) => void;
    onDownload?: (item: OutputAssetListItem) => void;
    onDownloadAll?: (items: OutputAssetListItem[]) => void;
    onMore?: (item: OutputAssetListItem) => void;
};

type FilterKind = 'all' | 'image' | 'video';
type SortKind = 'latest' | 'name';

const IMAGE_EXT_PATTERN = /\.(?:png|jpe?g|gif|webp|bmp|svg)(?:$|[?#])/i;
const VIDEO_EXT_PATTERN = /\.(?:mp4|mov|webm|m4v)(?:$|[?#])/i;

const getFileExtension = (name: string) => {
    const match = name.match(/\.([^.]+)$/);
    return match?.[1]?.toUpperCase() ?? 'FILE';
};

const resolveKind = (item: OutputAssetListItem): OutputAssetListKind => {
    if (item.kind) return item.kind;

    const mimeType = item.mimeType?.toLowerCase() ?? '';
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (IMAGE_EXT_PATTERN.test(item.name) || IMAGE_EXT_PATTERN.test(item.url ?? '')) return 'image';
    if (VIDEO_EXT_PATTERN.test(item.name) || VIDEO_EXT_PATTERN.test(item.url ?? '')) return 'video';
    return 'file';
};

const getMetaText = (item: OutputAssetListItem) => {
    const parts = [getFileExtension(item.name), item.sizeText, item.createdAtText].filter(Boolean);
    return parts.join(' · ');
};

const openPreview = (item: OutputAssetListItem, onPreview?: (item: OutputAssetListItem) => void) => {
    if (onPreview) {
        onPreview(item);
        return;
    }

    if (item.url) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
    }
};

const downloadAsset = (item: OutputAssetListItem, onDownload?: (item: OutputAssetListItem) => void) => {
    if (onDownload) {
        onDownload(item);
        return;
    }

    if (!item.url) return;

    const anchor = document.createElement('a');
    anchor.href = item.url;
    anchor.download = item.name;
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
};

const downloadAssets = (
    items: OutputAssetListItem[],
    onDownloadAll?: (items: OutputAssetListItem[]) => void,
    onDownload?: (item: OutputAssetListItem) => void
) => {
    if (onDownloadAll) {
        onDownloadAll(items);
        return;
    }

    items.filter((item) => item.url).forEach((item, index) => {
        window.setTimeout(() => downloadAsset(item, onDownload), index * 80);
    });
};

const OutputAssetList = ({
    items,
    title = '작업물 목록',
    description,
    emptyText = '등록된 작업물이 없습니다.',
    emptyDescription = '담당자가 아직 최종 작업물을 등록하지 않았습니다.',
    emptyIcon = <FiPackage />,
    className,
    variant = 'card',
    showHeader = true,
    showFilters = true,
    showSort = true,
    onPreview,
    onDownload,
    onDownloadAll,
    onMore,
}: OutputAssetListProps) => {
    const [filterKind, setFilterKind] = useState<FilterKind>('all');
    const [sortKind, setSortKind] = useState<SortKind>('latest');
    const itemModels = useMemo(
        () =>
            items.map((item, index) => ({
                ...item,
                kind: resolveKind(item),
                originalIndex: index,
            })),
        [items]
    );
    const imageCount = showFilters ? itemModels.filter((item) => item.kind === 'image').length : 0;
    const videoCount = showFilters ? itemModels.filter((item) => item.kind === 'video').length : 0;
    const visibleItems = useMemo(() => {
        const filtered =
            filterKind === 'all' ? itemModels : itemModels.filter((item) => item.kind === filterKind);

        return [...filtered].sort((left, right) => {
            if (sortKind === 'name') return left.name.localeCompare(right.name);
            return left.originalIndex - right.originalIndex;
        });
    }, [filterKind, itemModels, sortKind]);
    const downloadableItems = visibleItems.filter((item) => Boolean(item.url));

    return (
        <div className={classNames(styles.Root, className)} data-variant={variant}>
            {showHeader ? (
                <div className={styles.Header}>
                    <div className={styles.TitleWrap}>
                        {variant === 'table' ? (
                            <span className={styles.TitleIcon} aria-hidden="true">
                                <FiDownload />
                            </span>
                        ) : null}
                        <span className={styles.TitleCopy}>
                            <strong>{title}</strong>
                            {description ? <small>{description}</small> : null}
                        </span>
                    </div>
                    <div className={styles.HeaderActions}>
                        {variant === 'table' ? null : <em className={styles.TotalBadge}>총 {items.length}개</em>}
                        {showSort ? (
                            <select
                                className={styles.SortSelect}
                                value={sortKind}
                                aria-label="작업물 정렬"
                                onChange={(event) => setSortKind(event.target.value as SortKind)}
                            >
                                <option value="latest">최신순</option>
                                <option value="name">이름순</option>
                            </select>
                        ) : null}
                        {variant === 'table' ? (
                            <button
                                type="button"
                                className={styles.DownloadAllButton}
                                disabled={downloadableItems.length === 0}
                                onClick={() => downloadAssets(downloadableItems, onDownloadAll, onDownload)}
                            >
                                <FiDownload aria-hidden="true" />
                                전체 다운로드
                            </button>
                        ) : null}
                    </div>
                </div>
            ) : null}

            {showFilters ? (
                <div className={styles.FilterTabs} role="tablist" aria-label="작업물 유형 필터">
                    <button
                        type="button"
                        className={styles.FilterTab}
                        data-active={filterKind === 'all' ? 'true' : 'false'}
                        onClick={() => setFilterKind('all')}
                    >
                        전체
                    </button>
                    <button
                        type="button"
                        className={styles.FilterTab}
                        data-active={filterKind === 'image' ? 'true' : 'false'}
                        onClick={() => setFilterKind('image')}
                    >
                        이미지 {imageCount ? imageCount : ''}
                    </button>
                    <button
                        type="button"
                        className={styles.FilterTab}
                        data-active={filterKind === 'video' ? 'true' : 'false'}
                        onClick={() => setFilterKind('video')}
                    >
                        영상 {videoCount ? videoCount : ''}
                    </button>
                </div>
            ) : null}

            <div className={styles.List}>
                {variant === 'table' && visibleItems.length > 0 ? (
                    <div className={styles.TableHead} aria-hidden="true">
                        <span>파일명</span>
                        <span>정보</span>
                        <span>작업</span>
                    </div>
                ) : null}
                {visibleItems.length > 0 ? (
                    visibleItems.map((item, index) => {
                        const isVideo = item.kind === 'video';
                        const isImage = item.kind === 'image';
                        const statusTone = item.statusTone ?? (index === 0 ? 'blue' : 'green');
                        const statusLabel = item.statusLabel ?? (index === 0 ? '최신본' : '등록 완료');

                        return (
                            <article key={item.id} className={styles.Item}>
                                <div className={styles.FileCell}>
                                    <div className={styles.Thumb}>
                                        {isImage && item.url ? <img src={item.url} alt="" /> : null}
                                        {isVideo && item.url ? <video src={item.url} muted playsInline preload="metadata" /> : null}
                                        {!isImage && !isVideo ? <FiFile aria-hidden="true" /> : null}
                                        {isVideo ? (
                                            <span className={styles.PlayOverlay} aria-hidden="true">
                                                <FiPlayCircle />
                                            </span>
                                        ) : null}
                                    </div>
                                    <strong title={item.name}>{item.name}</strong>
                                </div>
                                <div className={styles.Meta}>
                                    <span>{getMetaText(item)}</span>
                                </div>
                                {variant === 'table' ? null : (
                                    <span className={styles.StatusBadge} data-tone={statusTone}>
                                        {statusLabel}
                                    </span>
                                )}
                                <div className={styles.ActionCell}>
                                    <button
                                        type="button"
                                        className={styles.PreviewButton}
                                        aria-label={`${item.name} 미리보기`}
                                        disabled={!item.url && !onPreview}
                                        onClick={() => openPreview(item, onPreview)}
                                    >
                                        <FiEye aria-hidden="true" />
                                    </button>
                                    {variant === 'table' ? (
                                        <button
                                            type="button"
                                            className={styles.DownloadButton}
                                            aria-label={`${item.name} 다운로드`}
                                            disabled={!item.url && !onDownload}
                                            onClick={() => downloadAsset(item, onDownload)}
                                        >
                                            <FiDownload aria-hidden="true" />
                                        </button>
                                    ) : null}
                                    {onMore ? (
                                        <button
                                            type="button"
                                            className={styles.MoreButton}
                                            aria-label={`${item.name} 더보기`}
                                            onClick={() => onMore(item)}
                                        >
                                            <FiMoreVertical aria-hidden="true" />
                                        </button>
                                    ) : null}
                                </div>
                            </article>
                        );
                    })
                ) : (
                    <EmptyStatePanel
                        icon={emptyIcon}
                        title={emptyText}
                        description={emptyDescription}
                        minHeight={96}
                    />
                )}
            </div>
        </div>
    );
};

export default OutputAssetList;
