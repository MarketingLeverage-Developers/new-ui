import React from 'react';
import GranterBaseButton from '../GranterBaseButton/GranterBaseButton';
import styles from './GranterGuideModal.module.scss';

export type GranterGuideModalItem = {
    id: string;
    icon?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
};

export type GranterGuideModalProps = {
    open: boolean;
    title: React.ReactNode;
    description?: React.ReactNode;
    guides?: GranterGuideModalItem[];
    closeLabel?: React.ReactNode;
    onClose?: () => void;
    onSelectGuide?: (guideId: string) => void;
};

const GranterGuideModal = ({
    open,
    title,
    description,
    guides = [],
    closeLabel = '닫기',
    onClose,
    onSelectGuide,
}: GranterGuideModalProps) => {
    if (!open) return null;

    return (
        <div className={styles.Backdrop} role="dialog" aria-modal="true" aria-label={String(title)}>
            <div className={styles.Modal}>
                <header className={styles.Header}>
                    <h3>{title}</h3>
                    <GranterBaseButton variant="ghost" size="sm" onClick={onClose}>
                        {closeLabel}
                    </GranterBaseButton>
                </header>

                {description ? <p className={styles.Description}>{description}</p> : null}

                <div className={styles.GuideList}>
                    {guides.map((guide) => (
                        <button
                            key={guide.id}
                            type="button"
                            className={styles.GuideItem}
                            onClick={() => onSelectGuide?.(guide.id)}
                        >
                            {guide.icon ? <span className={styles.GuideIcon}>{guide.icon}</span> : null}
                            <div className={styles.GuideContent}>
                                <strong>{guide.title}</strong>
                                {guide.description ? <span>{guide.description}</span> : null}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GranterGuideModal;
