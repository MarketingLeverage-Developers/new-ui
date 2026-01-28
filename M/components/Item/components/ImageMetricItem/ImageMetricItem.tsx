import React from 'react';
import styles from './ImageMetricItem.module.scss';
import { Common } from '@/shared/primitives/C/Common';

export type ImageMetricItemMetric = {
    label: string;
    value: string;
};

export type ImageMetricItemProps = {
    imageSrc?: string;
    imageAlt?: string;
    imagePrefix?: string;
    imageFit?: 'cover' | 'contain' | 'fill';
    rating?: React.ReactNode;
    metaTitle: string;
    metaSubtitle: string;
    metrics: ImageMetricItemMetric[];
    onClick?: () => void;
};

const ImageMetricItem = ({
    imageSrc,
    imageAlt,
    imagePrefix,
    imageFit = 'cover',
    rating,
    metaTitle,
    metaSubtitle,
    metrics,
    onClick,
}: ImageMetricItemProps) => (
    <div
        className={[styles.ImageMetricItem, onClick ? styles.Clickable : ''].filter(Boolean).join(' ')}
        onClick={onClick}
    >
        <div className={styles.ImageWrapper}>
            <Common.Image
                src={imageSrc}
                prefix={imagePrefix}
                alt={imageAlt ?? ''}
                className={styles.Image}
                width="100%"
                height="100%"
                fit={imageFit}
                block
            />
        </div>
        <div className={styles.Content}>
            {rating ? <div className={styles.Rating}>{rating}</div> : null}
            <div className={styles.Body}>
                <div className={styles.Meta}>
                    <span className={styles.MetaTitle}>{metaTitle}</span>
                    <span className={styles.MetaSubtitle}>{metaSubtitle}</span>
                </div>
                <div className={styles.Metrics}>
                    {metrics.map((metric, index) => (
                        <div className={styles.MetricRow} key={`${metric.label}-${index}`}>
                            <span className={styles.MetricLabel}>{metric.label}</span>
                            <div className={styles.MetricValueWrap}>
                                <span className={styles.MetricDivider} />
                                <span className={styles.MetricValue} title={metric.value}>
                                    {metric.value}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default ImageMetricItem;
