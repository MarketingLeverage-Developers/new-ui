import React from 'react';
import classNames from 'classnames';
import Text from '../Text/Text';
import styles from './SnapshotSummaryCard.module.scss';

export type SnapshotSummaryCardRowTone = 'default' | 'live' | 'waiting' | 'danger' | 'up' | 'down';

export type SnapshotSummaryCardRow = {
    label: React.ReactNode;
    value: React.ReactNode;
    tone?: SnapshotSummaryCardRowTone;
};

export type SnapshotSummaryCardSection = {
    title: React.ReactNode;
    rows: SnapshotSummaryCardRow[];
};

export type SnapshotSummaryCardProps = {
    className?: string;
    title?: React.ReactNode;
    primaryValue: React.ReactNode;
    primaryDescription?: React.ReactNode;
    secondaryLabel?: React.ReactNode;
    secondaryValue?: React.ReactNode;
    secondaryDescription?: React.ReactNode;
    sections?: SnapshotSummaryCardSection[];
    fullWidth?: boolean;
    variant?: 'default' | 'dashboard';
};

const SnapshotSummaryCard = ({
    className,
    title,
    primaryValue,
    primaryDescription,
    secondaryLabel,
    secondaryValue,
    secondaryDescription,
    sections = [],
    fullWidth = false,
    variant = 'default',
}: SnapshotSummaryCardProps) => {
    const hasSecondaryStat =
        secondaryLabel !== undefined || secondaryValue !== undefined || secondaryDescription !== undefined;

    return (
        <section
            className={classNames(styles.Card, fullWidth && styles.FullWidth, className)}
            data-variant={variant}
        >
            {title !== undefined ? (
                <div className={styles.Top}>
                    <Text as="span" size="xs" weight="semibold" className={styles.Title}>
                        {title}
                    </Text>
                </div>
            ) : null}

            <div className={classNames(styles.HeroBody, !hasSecondaryStat && styles.HeroBodySingle)}>
                <div className={styles.Headline}>
                    <Text as="strong" weight="regular" className={styles.PrimaryValue}>
                        {primaryValue}
                    </Text>
                    {primaryDescription !== undefined ? (
                        <Text as="p" size="sm" tone="muted" className={styles.PrimaryDescription}>
                            {primaryDescription}
                        </Text>
                    ) : null}
                </div>

                {hasSecondaryStat ? (
                    <div className={styles.SecondaryStat}>
                        {secondaryLabel !== undefined ? (
                            <Text as="span" size="xs" tone="muted" weight="semibold" className={styles.SecondaryLabel}>
                                {secondaryLabel}
                            </Text>
                        ) : null}
                        {secondaryValue !== undefined ? (
                            <Text as="strong" weight="semibold" className={styles.SecondaryValue}>
                                {secondaryValue}
                            </Text>
                        ) : null}
                        {secondaryDescription !== undefined ? (
                            <Text as="span" size="sm" tone="muted">
                                {secondaryDescription}
                            </Text>
                        ) : null}
                    </div>
                ) : null}
            </div>

            {sections.length > 0 ? (
                <div className={styles.Sections}>
                    {sections.map((section, sectionIndex) => (
                        <div
                            key={String(section.title)}
                            className={styles.Section}
                            data-section-index={sectionIndex}
                        >
                            <div className={styles.SectionHeader}>
                                <Text as="h3" size="md" weight="semibold">
                                    {section.title}
                                </Text>
                            </div>

                            <div className={styles.SectionRows}>
                                {section.rows.map((row) => (
                                    <div key={String(row.label)} className={styles.SectionRow} data-tone={row.tone ?? 'default'}>
                                        <Text as="span" size="sm" tone="inherit" className={styles.RowLabel}>
                                            {row.label}
                                        </Text>
                                        <Text as="strong" size="lg" tone="inherit" weight="semibold" className={styles.RowValue}>
                                            {row.value}
                                        </Text>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : null}
        </section>
    );
};

export default SnapshotSummaryCard;
