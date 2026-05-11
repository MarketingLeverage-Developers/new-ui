import React from 'react';
import classNames from 'classnames';
import { FiAlertOctagon, FiAlertTriangle, FiCheckCircle, FiX } from 'react-icons/fi';
import WhiteButton from '../Button/WhiteButton';
import styles from './FloatingStatusAlert.module.scss';

export type FloatingStatusAlertStatus = 'error' | 'warning' | 'normal';

export type FloatingStatusAlertProps = {
    open: boolean;
    status?: FloatingStatusAlertStatus;
    title: React.ReactNode;
    descriptionLines?: React.ReactNode[];
    actionLabel?: React.ReactNode;
    onAction?: () => void;
    onClose?: () => void;
    closeAriaLabel?: string;
    className?: string;
};

export type FloatingStatusAlertTriggerProps = {
    visible?: boolean;
    status?: FloatingStatusAlertStatus;
    label?: React.ReactNode;
    ariaLabel?: string;
    onClick?: () => void;
    className?: string;
};

const STATUS_CONFIG: Record<
    FloatingStatusAlertStatus,
    {
        defaultTriggerLabel: string;
        defaultTriggerAriaLabel: string;
        icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
    }
> = {
    error: {
        defaultTriggerLabel: '오류 확인',
        defaultTriggerAriaLabel: '오류 알림 다시 열기',
        icon: FiAlertOctagon,
    },
    warning: {
        defaultTriggerLabel: '경고 확인',
        defaultTriggerAriaLabel: '경고 알림 다시 열기',
        icon: FiAlertTriangle,
    },
    normal: {
        defaultTriggerLabel: '정상',
        defaultTriggerAriaLabel: '정상 상태 알림 열기',
        icon: FiCheckCircle,
    },
};

const FloatingStatusAlertIcon = ({
    status,
    size,
}: {
    status: FloatingStatusAlertStatus;
    size: number;
}) => {
    const Icon = STATUS_CONFIG[status].icon;

    return <Icon size={size} strokeWidth={2.4} />;
};

export const FloatingStatusAlertTrigger = React.memo(
    ({
        visible = true,
        status = 'warning',
        label,
        ariaLabel,
        onClick,
        className,
    }: FloatingStatusAlertTriggerProps) => {
        if (!visible) {
            return null;
        }

        const resolvedLabel = label ?? STATUS_CONFIG[status].defaultTriggerLabel;

        return (
            <button
                type="button"
                className={classNames(styles.Trigger, className)}
                data-status={status}
                aria-label={ariaLabel ?? STATUS_CONFIG[status].defaultTriggerAriaLabel}
                onClick={onClick}
            >
                <span className={styles.TriggerIcon} aria-hidden="true">
                    <FloatingStatusAlertIcon status={status} size={14} />
                </span>
                <span className={styles.TriggerLabel}>{resolvedLabel}</span>
            </button>
        );
    }
);

FloatingStatusAlertTrigger.displayName = 'FloatingStatusAlertTrigger';

const FloatingStatusAlert = React.memo(
    ({
        open,
        status = 'warning',
        title,
        descriptionLines = [],
        actionLabel,
        onAction,
        onClose,
        closeAriaLabel,
        className,
    }: FloatingStatusAlertProps) => {
        if (!open) {
            return null;
        }

        return (
            <aside
                className={classNames(styles.Root, className)}
                role={status === 'normal' ? 'status' : 'alert'}
                aria-live={status === 'error' ? 'assertive' : 'polite'}
                data-status={status}
            >
                <div className={styles.Card}>
                    <div className={styles.IconWrap} aria-hidden="true" data-status={status}>
                        <FloatingStatusAlertIcon status={status} size={18} />
                    </div>

                    <div className={styles.Content}>
                        <h2 className={styles.Title}>{title}</h2>
                        {descriptionLines.length > 0 ? (
                            <div className={styles.Description}>
                                {descriptionLines.map((line, index) => (
                                    <span key={index}>{line}</span>
                                ))}
                            </div>
                        ) : null}
                        {actionLabel ? (
                            <WhiteButton
                                size="sm"
                                className={styles.ActionButton}
                                onClick={onAction}
                            >
                                {actionLabel}
                            </WhiteButton>
                        ) : null}
                    </div>

                    {onClose ? (
                        <button
                            type="button"
                            className={styles.CloseButton}
                            aria-label={closeAriaLabel ?? '상태 알림 닫기'}
                            onClick={onClose}
                        >
                            <FiX size={22} strokeWidth={1.8} />
                        </button>
                    ) : null}
                </div>
            </aside>
        );
    }
);

FloatingStatusAlert.displayName = 'FloatingStatusAlert';

export default Object.assign(FloatingStatusAlert, {
    Trigger: FloatingStatusAlertTrigger,
});
