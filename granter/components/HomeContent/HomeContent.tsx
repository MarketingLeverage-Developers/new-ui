import React from 'react';
import styles from './HomeContent.module.scss';

export type HomeContentProps = {
    title?: string;
    activeMenuLabel?: string;
    activeSectionLabel?: string;
    dateLabel?: string;
    variant?: 'empty' | 'overview';
    statusMessage?: string;
};

const HomeContent = ({
    title = '홈',
    activeMenuLabel = '홈',
    activeSectionLabel = '알림',
    dateLabel = '',
    variant = 'empty',
    statusMessage = '최근 12개월 치 데이터를 불러온 후 정리하고 있어요. 1시간 이상 소요될 수 있어요.',
}: HomeContentProps) =>
    variant === 'empty' ? (
        <div className={styles.HomeContent} data-variant="empty">
            <section className={styles.EmptyState}>
                <p className={styles.StatusMessage}>{statusMessage}</p>
            </section>
        </div>
    ) : (
        <div className={styles.HomeContent} data-variant="overview">
            <section className={styles.Hero}>
                <div className={styles.HeroCopy}>
                    <span className={styles.Eyebrow}>Workspace Home</span>
                    <strong className={styles.HeroTitle}>{title}</strong>
                    <p className={styles.HeroDescription}>
                        선택된 메뉴는 <b>{activeMenuLabel}</b>, 현재 섹션은 <b>{activeSectionLabel}</b> 입니다.
                    </p>
                </div>

                <div className={styles.DateCard}>
                    <span className={styles.DateLabel}>현재 조회 기간</span>
                    <strong className={styles.DateValue}>{dateLabel}</strong>
                </div>
            </section>

            <section className={styles.MetricGrid}>
                <article className={styles.MetricCard}>
                    <span className={styles.MetricTitle}>오늘 확인할 항목</span>
                    <strong className={styles.MetricValue}>12</strong>
                    <p className={styles.MetricDescription}>템플릿 슬롯 구조로 메뉴별 카드 구성이 가능합니다.</p>
                </article>

                <article className={styles.MetricCard}>
                    <span className={styles.MetricTitle}>활성 자동화</span>
                    <strong className={styles.MetricValue}>08</strong>
                    <p className={styles.MetricDescription}>메인 영역은 독립 컴포넌트로 교체할 수 있습니다.</p>
                </article>

                <article className={styles.MetricCard}>
                    <span className={styles.MetricTitle}>검토 필요</span>
                    <strong className={styles.MetricValue}>03</strong>
                    <p className={styles.MetricDescription}>페이지는 상태와 액션만 들고, UI는 레이아웃에서 조립합니다.</p>
                </article>
            </section>
        </div>
    );

export default HomeContent;
