import React from 'react';
import classNames from 'classnames';
import { FaGear } from 'react-icons/fa6';
import UnderlineSearch from '@/components/common/UnderlineSearch/UnderlineSearch';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import styles from './GranterSideSearchBar.module.scss';

export type GranterSideSearchBarItem = {
    key: string;
    title: React.ReactNode;
    imageSrc?: string;
    imageAlt?: string;
    subMeta?: React.ReactNode;
    trailing?: React.ReactNode;
    disabled?: boolean;
};

export type GranterSideSearchBarProps = {
    className?: string;
    title?: React.ReactNode;
    titleImageSrc?: string;
    titleImageAlt?: string;
    onTitleClick?: () => void;
    onTitleSettingClick?: () => void;
    showTitleSetting?: boolean;
    titleTrailing?: React.ReactNode;
    searchValue: string;
    searchPlaceholder?: string;
    onSearchChange?: (value: string) => void;
    totalCount?: number;
    items: GranterSideSearchBarItem[];
    selectedItemKey?: string;
    onItemClick?: (itemKey: string) => void;
    emptyText?: React.ReactNode;
};

const GranterSideSearchBar = ({
    className,
    title,
    titleImageSrc,
    titleImageAlt = '업체 이미지',
    onTitleClick,
    onTitleSettingClick,
    showTitleSetting = false,
    titleTrailing,
    searchValue,
    searchPlaceholder = '검색',
    onSearchChange,
    totalCount,
    items,
    selectedItemKey,
    onItemClick,
    emptyText = '목록이 없습니다.',
}: GranterSideSearchBarProps) => (
    <div className={classNames(styles.SidebarLayout, className)}>
        {(title || titleTrailing || showTitleSetting) && (
            <div className={styles.Header}>
                <div className={styles.CompanyRow}>
                    {onTitleClick ? (
                        <button type="button" className={styles.HeaderMainButton} onClick={onTitleClick}>
                            {titleImageSrc ? (
                                <img className={styles.HeaderImage} src={titleImageSrc} alt={titleImageAlt} />
                            ) : null}
                            <span className={styles.HeaderTitle}>{title}</span>
                        </button>
                    ) : (
                        <div className={styles.HeaderMain}>
                            {titleImageSrc ? (
                                <img className={styles.HeaderImage} src={titleImageSrc} alt={titleImageAlt} />
                            ) : null}
                            <span className={styles.HeaderTitle}>{title}</span>
                        </div>
                    )}
                    <div className={styles.HeaderRight}>
                        {titleTrailing ? <span className={styles.HeaderTrailing}>{titleTrailing}</span> : null}
                        {showTitleSetting ? (
                            <button
                                type="button"
                                className={styles.HeaderSettingButton}
                                aria-label="설정"
                                onClick={onTitleSettingClick}
                            >
                                <FaGear color={getThemeColor("Gray8")} />
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        )}

        <div className={styles.ControlArea}>
            <div className={styles.SearchRow}>
                <UnderlineSearch
                    value={searchValue}
                    placeholder={searchPlaceholder}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    color={getThemeColor('Gray8')}
                />
            </div>

            {typeof totalCount === 'number' ? (
                <div className={styles.TotalRow}>
                    총 <span>{totalCount}</span>개
                </div>
            ) : null}
        </div>

        <div className={styles.ListViewport}>
            <div className={styles.List}>
                {items.length > 0 ? (
                    items.map((item) => {
                        const isSelected = selectedItemKey === item.key;
                        return (
                            <button
                                key={item.key}
                                type="button"
                                disabled={item.disabled}
                                className={classNames(styles.ItemButton, {
                                    [styles.ItemButtonSelected]: isSelected,
                                })}
                                onClick={() => {
                                    if (item.disabled) return;
                                    onItemClick?.(item.key);
                                }}
                            >
                                <div className={styles.ItemMain}>
                                    <div className={styles.ItemLeft}>
                                        {item.imageSrc ? (
                                            <img
                                                className={styles.ItemImage}
                                                src={item.imageSrc}
                                                alt={item.imageAlt ?? '업체 이미지'}
                                            />
                                        ) : null}
                                        <span className={styles.ItemTitle}>{item.title}</span>
                                    </div>
                                    {item.trailing ? <span className={styles.ItemTrailing}>{item.trailing}</span> : null}
                                </div>
                                {item.subMeta ? <p className={styles.ItemMeta}>{item.subMeta}</p> : null}
                            </button>
                        );
                    })
                ) : (
                    <div className={styles.Empty}>{emptyText}</div>
                )}
            </div>
        </div>
    </div>
);

export default GranterSideSearchBar;
