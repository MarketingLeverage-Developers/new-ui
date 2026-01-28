import React from 'react';
import BaseChip from '@/shared/primitives/BaseChip/BaseChip';
import SectionDiver from '@/shared/primitives/SectionDiver/SectionDiver';
import styles from './RequestDetailSummary.module.scss';
import DefaultSummaryImage from '@/shared/assets/images/Picture.svg';
import { Common } from '@/shared/primitives/C/Common';

export type RequestDetailSummaryTag = {
    id?: string | number;
    label: string;
};

export type RequestDetailSummaryRow = {
    label: string;
    value: React.ReactNode;
};

export type RequestDetailSummaryProps = {
    imageSrc?: string;
    imageAlt?: string;
    imagePrefix?: string;
    imageHeight?: number | string;
    imageFit?: 'cover' | 'contain';
    title: string;
    feedbackCount: number;
    tags?: RequestDetailSummaryTag[];
    expectedWorkTime: number;
    onRequest: () => void;
    requestButtonText?: string;
    summaryTitle?: string;
    summaryRows?: RequestDetailSummaryRow[];
    summaryNote?: string;
    divider?: React.ReactNode;
};

const RequestDetailSummary = ({
    imageSrc,
    imageAlt,
    imagePrefix,
    imageHeight = 240,
    imageFit = 'contain',
    title,
    feedbackCount,
    tags = [],
    expectedWorkTime,
    onRequest,
    requestButtonText = '요청하기 >',
    summaryTitle = '성과 요약 (최근 3개월 기준)',
    summaryRows = [],
    summaryNote = '* 최소 광고비 10만원 이상 광고들의 평균 값입니다.',
    divider = <SectionDiver />,
}: RequestDetailSummaryProps) => {
    const resolvedImageSrc = imageSrc && imageSrc.trim().length > 0 ? imageSrc : DefaultSummaryImage;

    return (
        <div className={styles.Wrapper}>
            <Common.Image
                src={resolvedImageSrc}
                prefix={imagePrefix}
                alt={imageAlt ?? `${title}-템플릿 이미지`}
                fallbackText="이미지 없음"
                radius={12}
                width="100%"
                height={imageHeight}
                fit={imageFit}
            />
            <div className={styles.Content}>
                <div className={styles.Header}>
                    <div className={styles.TitleBlock}>
                        <span className={styles.Title}>{title}</span>
                        <div className={styles.FeedbackBlock}>
                            <div className={styles.FeedbackLabelRow}>
                                <span className={styles.FeedbackLabel}>후기</span>
                                <span className={styles.FeedbackValue}>{feedbackCount}</span>
                            </div>
                            <div className={styles.TagList}>
                                {tags.map((tag) => (
                                    <BaseChip
                                        bgColor="var(--Gray5)"
                                        textColor="var(--Black1)"
                                        radius={6}
                                        key={tag.id ?? tag.label}
                                        padding={{ x: 8, y: 5 }}
                                    >
                                        {tag.label}
                                    </BaseChip>
                                ))}
                            </div>
                        </div>
                    </div>
                    <span className={styles.ExpectedWorkTime}>{expectedWorkTime} 분 소요 예상</span>
                </div>
                <button className={styles.RequestButton} type="button" onClick={onRequest}>
                    {requestButtonText}
                </button>
                {divider ? <div className={styles.Divider}>{divider}</div> : null}
                <div className={styles.Summary}>
                    <span className={styles.SummaryTitle}>{summaryTitle}</span>
                    <div className={styles.SummaryRows}>
                        {summaryRows.map((row, index) => (
                            <div className={styles.SummaryRow} key={`${row.label}-${index}`}>
                                <span className={styles.SummaryLabel}>{row.label}</span>
                                <span className={styles.SummaryValue}>{row.value}</span>
                            </div>
                        ))}
                    </div>
                    <span className={styles.SummaryNote}>{summaryNote}</span>
                </div>
            </div>
        </div>
    );
};

export default RequestDetailSummary;
