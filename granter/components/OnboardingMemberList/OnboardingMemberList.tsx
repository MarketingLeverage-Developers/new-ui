import { useState } from 'react';
import { PiMagnifyingGlass, PiX } from 'react-icons/pi';
import styles from './OnboardingMemberList.module.scss';

export type OnboardingMemberListItem = {
    /** 고유 식별자 (value) */
    value: string;
    /** 표시할 이름 */
    name: string;
    /** 부가 정보 (직책, 이메일 등) ─ dot 구분으로 한 줄 표시 */
    meta?: string;
    /** 프로필 이미지 URL (없으면 이니셜 폴백) */
    profileImageUrl?: string;
    /** 비활성화 여부 */
    disabled?: boolean;
};

export type OnboardingMemberListProps = {
    /** 현재 선택된 value (single 선택 모드) */
    value?: string;
    /** 현재 선택된 value 목록 (multiple 선택 모드) */
    selectedValues?: string[];
    /** 선택 모드 */
    selectionMode?: 'single' | 'multiple';
    /** 표시할 멤버 목록 */
    items: OnboardingMemberListItem[];
    /** value 변경 콜백 (single 선택 모드) */
    onChange?: (value: string) => void;
    /** value 토글 콜백 (multiple 선택 모드) */
    onToggle?: (value: string) => void;
    /** 검색 placeholder */
    searchPlaceholder?: string;
    /** aria-label */
    ariaLabel?: string;
    className?: string;
};

const OnboardingMemberList = ({
    value = '',
    selectedValues = [],
    selectionMode = 'single',
    items,
    onChange,
    onToggle,
    searchPlaceholder = '이름이나 메일로 찾기',
    ariaLabel,
    className,
}: OnboardingMemberListProps) => {
    const [query, setQuery] = useState('');
    const normalized = query.trim().toLowerCase();

    const filtered = normalized
        ? items.filter(
              (item) =>
                  item.name.toLowerCase().includes(normalized) ||
                  item.meta?.toLowerCase().includes(normalized)
          )
        : items;

    const isMultipleSelection = selectionMode === 'multiple';

    return (
        <div
            className={[styles.Root, className].filter(Boolean).join(' ')}
            role="listbox"
            aria-label={ariaLabel}
            aria-multiselectable={isMultipleSelection ? 'true' : undefined}
        >
            {/* 검색 */}
            <div className={styles.Search}>
                <PiMagnifyingGlass size={16} className={styles.SearchIcon} aria-hidden="true" />
                <input
                    type="text"
                    className={styles.SearchInput}
                    placeholder={searchPlaceholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label={searchPlaceholder}
                />
                {query ? (
                    <button
                        type="button"
                        className={styles.SearchClear}
                        aria-label="검색어 지우기"
                        onClick={() => setQuery('')}
                    >
                        <PiX size={11} aria-hidden="true" />
                    </button>
                ) : null}
            </div>

            {/* 리스트 */}
            <div className={styles.Items}>
                {filtered.length === 0 ? (
                    <div className={styles.Empty}>검색 결과가 없습니다.</div>
                ) : (
                    filtered.map((item) => {
                        const isSelected = isMultipleSelection
                            ? selectedValues.includes(item.value)
                            : item.value === value;
                        const initial = (item.name || '?')[0].toUpperCase();

                        return (
                            <button
                                key={item.value}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                aria-pressed={isSelected}
                                className={styles.Item}
                                data-selected={isSelected ? 'true' : 'false'}
                                disabled={item.disabled}
                                onClick={() => {
                                    if (isMultipleSelection) {
                                        onToggle?.(item.value);
                                        return;
                                    }
                                    onChange?.(item.value);
                                }}
                            >
                                {/* 아바타 */}
                                <div className={styles.Avatar} aria-hidden="true">
                                    {item.profileImageUrl ? (
                                        <img
                                            src={item.profileImageUrl}
                                            alt=""
                                            className={styles.AvatarImage}
                                        />
                                    ) : (
                                        <span className={styles.AvatarFallback}>{initial}</span>
                                    )}
                                </div>

                                {/* 이름 + 메타 */}
                                <div className={styles.Info}>
                                    <span className={styles.Name}>{item.name}</span>
                                    {item.meta ? (
                                        <span className={styles.Meta}>{item.meta}</span>
                                    ) : null}
                                </div>

                                {/* 체크 마커 */}
                                <div className={styles.Check} aria-hidden="true">
                                    <span className={styles.CheckIcon} />
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default OnboardingMemberList;
