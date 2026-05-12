import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { FiAlertTriangle, FiArrowLeft, FiChevronRight, FiX } from 'react-icons/fi';
import WhiteButton from '../Button/WhiteButton';
import styles from './FloatingIssueNotice.module.scss';

export type FloatingIssueNoticeIssue = {
    key: string;
    label: React.ReactNode;
    icon?: React.ReactNode;
    ariaLabel?: string;
    detailTitle?: React.ReactNode;
    detailDescriptionLines?: React.ReactNode[];
    detailContent?: React.ReactNode;
    actionLabel?: React.ReactNode;
    onAction?: () => void;
};

export type FloatingIssueNoticeProps = {
    open: boolean;
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    issues: FloatingIssueNoticeIssue[];
    onClose?: () => void;
    closeAriaLabel?: string;
    className?: string;
};

export type FloatingIssueNoticeTriggerProps = {
    visible?: boolean;
    label?: React.ReactNode;
    ariaLabel?: string;
    onClick?: () => void;
    className?: string;
};

const DEFAULT_TITLE = '확인 필요';
const DEFAULT_SUBTITLE = '아래 항목을 확인해주세요.';
const DEFAULT_TRIGGER_LABEL = '확인 필요';
const DEFAULT_TRIGGER_ARIA_LABEL = '확인 필요 안내 다시 열기';

const hasIssueDetail = (issue: FloatingIssueNoticeIssue) =>
    Boolean(
        issue.detailTitle ||
            issue.detailDescriptionLines?.length ||
            issue.detailContent ||
            issue.actionLabel
    );

export const FloatingIssueNoticeTrigger = React.memo(
    ({
        visible = true,
        label,
        ariaLabel,
        onClick,
        className,
    }: FloatingIssueNoticeTriggerProps) => {
        if (!visible) {
            return null;
        }

        const resolvedLabel = label ?? DEFAULT_TRIGGER_LABEL;

        return (
            <button
                type="button"
                className={classNames(styles.Trigger, className)}
                aria-label={ariaLabel ?? DEFAULT_TRIGGER_ARIA_LABEL}
                onClick={onClick}
            >
                <span className={styles.TriggerIcon} aria-hidden="true">
                    <FiAlertTriangle size={14} strokeWidth={2.4} />
                </span>
                <span className={styles.TriggerLabel}>{resolvedLabel}</span>
            </button>
        );
    }
);

FloatingIssueNoticeTrigger.displayName = 'FloatingIssueNoticeTrigger';

const FloatingIssueNotice = React.memo(
    ({
        open,
        title = DEFAULT_TITLE,
        subtitle = DEFAULT_SUBTITLE,
        issues,
        onClose,
        closeAriaLabel,
        className,
    }: FloatingIssueNoticeProps) => {
        const [selectedIssueKey, setSelectedIssueKey] = useState('');
        const selectedIssue = useMemo(
            () => issues.find((issue) => issue.key === selectedIssueKey),
            [issues, selectedIssueKey]
        );

        useEffect(() => {
            if (!open) {
                setSelectedIssueKey('');
                return;
            }

            if (selectedIssueKey && !selectedIssue) {
                setSelectedIssueKey('');
            }
        }, [open, selectedIssue, selectedIssueKey]);

        if (!open || issues.length === 0) {
            return null;
        }

        const isDetailMode = Boolean(selectedIssue);
        const resolvedTitle = selectedIssue?.detailTitle ?? selectedIssue?.label ?? title;
        const resolvedSubtitle = isDetailMode ? null : subtitle;

        return (
            <aside
                className={classNames(styles.Root, className)}
                data-detail-mode={isDetailMode ? 'true' : 'false'}
                role="alert"
                aria-live="polite"
            >
                <div className={styles.Card} data-detail-mode={isDetailMode ? 'true' : 'false'}>
                    <div className={styles.Header} data-detail-mode={isDetailMode ? 'true' : 'false'}>
                        {isDetailMode ? (
                            <button
                                type="button"
                                className={styles.BackButton}
                                aria-label="확인 필요 목록으로 돌아가기"
                                onClick={() => setSelectedIssueKey('')}
                            >
                                <FiArrowLeft size={18} strokeWidth={2} />
                            </button>
                        ) : (
                            <span className={styles.TitleIcon} aria-hidden="true">
                                <FiAlertTriangle size={18} strokeWidth={2.2} />
                            </span>
                        )}

                        <span className={styles.TitleGroup}>
                            <h2 className={styles.Title}>{resolvedTitle}</h2>
                            {resolvedSubtitle ? (
                                <p className={styles.Subtitle}>{resolvedSubtitle}</p>
                            ) : null}
                        </span>

                        {onClose ? (
                            <button
                                type="button"
                                className={styles.CloseButton}
                                aria-label={closeAriaLabel ?? '운영 이슈 안내 닫기'}
                                onClick={onClose}
                            >
                                <FiX size={20} strokeWidth={1.8} />
                            </button>
                        ) : null}
                    </div>

                    {selectedIssue ? (
                        <div className={styles.DetailContent}>
                            {selectedIssue.detailDescriptionLines?.length ? (
                                <div className={styles.DetailDescription}>
                                    {selectedIssue.detailDescriptionLines.map((line, index) => (
                                        <span key={index}>{line}</span>
                                    ))}
                                </div>
                            ) : null}

                            {selectedIssue.detailContent ? (
                                <div className={styles.DetailExtra}>{selectedIssue.detailContent}</div>
                            ) : null}

                            {selectedIssue.actionLabel ? (
                                <WhiteButton
                                    size="sm"
                                    className={styles.ActionButton}
                                    onClick={selectedIssue.onAction}
                                >
                                    {selectedIssue.actionLabel}
                                </WhiteButton>
                            ) : null}
                        </div>
                    ) : (
                        <div className={styles.IssueList}>
                            {issues.map((issue) => (
                                <button
                                    key={issue.key}
                                    type="button"
                                    className={styles.IssueButton}
                                    aria-label={issue.ariaLabel}
                                    onClick={() => {
                                        if (hasIssueDetail(issue)) {
                                            setSelectedIssueKey(issue.key);
                                            return;
                                        }

                                        issue.onAction?.();
                                    }}
                                >
                                    <span className={styles.IssueIcon} aria-hidden="true">
                                        {issue.icon ?? (
                                            <FiAlertTriangle size={15} strokeWidth={2.2} />
                                        )}
                                    </span>
                                    <span className={styles.IssueLabel}>{issue.label}</span>
                                    <FiChevronRight
                                        className={styles.IssueChevron}
                                        size={18}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </aside>
        );
    }
);

FloatingIssueNotice.displayName = 'FloatingIssueNotice';

export default Object.assign(FloatingIssueNotice, {
    Trigger: FloatingIssueNoticeTrigger,
});
