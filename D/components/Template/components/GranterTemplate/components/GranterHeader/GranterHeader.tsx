import React from 'react';
import GranterBackButton from '../../../../../Button/components/GranterBackButton/GranterBackButton';
import GranterHeaderDatePicker from '../GranterHeaderDatePicker/GranterHeaderDatePicker';
import type { GranterDatePreset } from '../GranterDateSwaperWithPanel/GranterDateSwaperWithPanel';
import styles from './GranterHeader.module.scss';

export type GranterHeaderProps = {
    title: React.ReactNode;
    parentTitle?: React.ReactNode;
    dateRange?: React.ReactNode;
    rightActions?: React.ReactNode;
    showSidebarButton?: boolean;
    onSidebarButtonClick?: () => void;
    onBackClick?: () => void;
    onPrevDateClick?: () => void;
    onNextDateClick?: () => void;
    datePresets?: GranterDatePreset[];
    monthPresets?: GranterDatePreset[];
};

const GranterHeader = ({
    title,
    parentTitle,
    dateRange,
    rightActions,
    showSidebarButton,
    onSidebarButtonClick,
    onBackClick,
    onPrevDateClick,
    onNextDateClick,
}: GranterHeaderProps) => (
    <header className={styles.Header}>
        <div className={styles.Left}>
            {showSidebarButton ? (
                <button type="button" className={styles.SidebarButton} onClick={onSidebarButtonClick}>
                    <span className={styles.IconChevron}>≡</span>
                </button>
            ) : null}

            <GranterBackButton onClick={onBackClick} />

            <div className={styles.Breadcrumb}>
                {parentTitle ? <span className={styles.ParentTitle}>{parentTitle}</span> : null}
                <span className={styles.Title}>{title}</span>
            </div>
        </div>

        <div className={styles.Center}>
            <GranterHeaderDatePicker
                dateRangeLabel={dateRange ?? '2026-03-01 ~ 2026-03-31'}
                onPrevClick={onPrevDateClick}
                onNextClick={onNextDateClick}
            />
        </div>

        <div className={styles.Right}>{rightActions}</div>
    </header>
);

export default GranterHeader;
