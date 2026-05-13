import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import { FiInfo, FiX } from 'react-icons/fi';
import styles from './NoticeBanner.module.scss';

export type NoticeBannerTone = 'info' | 'warning';
export type NoticeBannerChipVariant = 'label' | 'media';

export type NoticeBannerChip = {
    key?: string;
    icon?: ReactNode;
    label: ReactNode;
    title?: string;
    variant?: NoticeBannerChipVariant;
};

export type NoticeBannerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
    tone?: NoticeBannerTone;
    icon?: ReactNode;
    children: ReactNode;
    chips?: NoticeBannerChip[];
    onClose?: () => void;
    closeAriaLabel?: string;
    style?: CSSProperties;
};

const toneClassName: Record<NoticeBannerTone, string> = {
    info: styles.Info,
    warning: styles.Warning,
};

const NoticeBanner = ({
    tone = 'info',
    icon,
    children,
    chips = [],
    onClose,
    closeAriaLabel = '안내 닫기',
    className,
    ...props
}: NoticeBannerProps) => {
    const rootClassName = [
        styles.Root,
        toneClassName[tone],
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={rootClassName} role="status" {...props}>
            <span className={styles.Icon} aria-hidden="true">
                {icon ?? <FiInfo size={13} strokeWidth={2.4} />}
            </span>
            <div className={styles.Body}>
                <span className={styles.Content}>{children}</span>
                {chips.length > 0 ? (
                    <span className={styles.ChipList} aria-label="대상 목록">
                        {chips.map((chip, index) => (
                            <span
                                key={chip.key ?? String(index)}
                                className={[
                                    styles.Chip,
                                    chip.variant === 'label' ? styles.ChipLabel : styles.ChipMedia,
                                ].join(' ')}
                                title={chip.title}
                            >
                                {chip.icon ? (
                                    <span className={styles.ChipIcon} aria-hidden="true">
                                        {chip.icon}
                                    </span>
                                ) : null}
                                {chip.label}
                            </span>
                        ))}
                    </span>
                ) : null}
            </div>
            {onClose ? (
                <button
                    type="button"
                    className={styles.CloseButton}
                    aria-label={closeAriaLabel}
                    onClick={onClose}
                >
                    <FiX size={16} strokeWidth={2.2} />
                </button>
            ) : null}
        </div>
    );
};

export default NoticeBanner;
