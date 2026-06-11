import React from 'react';
import classNames from 'classnames';
import Text from '../Text/Text';
import styles from './RegionPreview.module.scss';

export type RegionPreviewRegion = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type RegionPreviewProps = {
    src?: string | null;
    alt?: string;
    region?: RegionPreviewRegion | null;
    assetOriginalWidth?: number | null;
    assetOriginalHeight?: number | null;
    label?: React.ReactNode;
    emptyText?: React.ReactNode;
    className?: string;
};

const toNumber = (value?: number | null) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
};

const getCropStyle = (region: RegionPreviewRegion) => {
    const width = Math.max(toNumber(region.width), 0.0001);
    const height = Math.max(toNumber(region.height), 0.0001);

    return {
        left: `${-(toNumber(region.x) / width) * 100}%`,
        top: `${-(toNumber(region.y) / height) * 100}%`,
        width: `${100 / width}%`,
        height: `${100 / height}%`,
    };
};

const getAspectRatio = (
    region: RegionPreviewRegion,
    assetOriginalWidth?: number | null,
    assetOriginalHeight?: number | null
) => {
    const width = Math.max(toNumber(region.width) * (assetOriginalWidth || 1), 1);
    const height = Math.max(toNumber(region.height) * (assetOriginalHeight || 1), 1);

    return `${width} / ${height}`;
};

const RegionPreview = ({
    src,
    alt = '선택 영역 미리보기',
    region,
    assetOriginalWidth,
    assetOriginalHeight,
    label = '선택 영역 미리보기',
    emptyText = '선택된 영역이 없습니다.',
    className,
}: RegionPreviewProps) => {
    const canPreview = Boolean(src && region);

    return (
        <div className={classNames(styles.Root, className)}>
            {label ? (
                <Text size="sm" weight="semibold" tone="default">
                    {label}
                </Text>
            ) : null}

            {canPreview && region ? (
                <div
                    className={styles.Frame}
                    style={{ aspectRatio: getAspectRatio(region, assetOriginalWidth, assetOriginalHeight) }}
                >
                    <img src={src ?? undefined} alt={alt} style={getCropStyle(region)} />
                </div>
            ) : (
                <div className={styles.Empty}>
                    <Text size="sm" tone="muted" weight="medium">
                        {emptyText}
                    </Text>
                </div>
            )}
        </div>
    );
};

export default RegionPreview;
