import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { FiSearch } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import type { Swiper as SwiperCore } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import MemberProfileAvatar from '@/components/common/MemberProfileAvatar/MemberProfileAvatar';
import { getFallbackUserProfileSrc } from '@/shared/utils/profile/getFallbackUserProfileSrc';
import 'swiper/css';
import styles from './MobileOnboardingMemberCarousel.module.scss';

export type MobileOnboardingMemberCarouselItem<T extends string = string> = {
    value: T;
    name: string;
    eyebrow?: string;
    description?: string;
    searchText?: string;
    profileImageUrl?: string | null;
    disabled?: boolean;
};

export type MobileOnboardingMemberCarouselProps<T extends string = string> = {
    items: MobileOnboardingMemberCarouselItem<T>[];
    value?: T | null;
    onChange: (value: T) => void;
    className?: string;
    emptyText?: string;
    noResultsText?: string;
    ariaLabel?: string;
    searchable?: boolean;
    searchPlaceholder?: string;
};

const resolveProfileImageSrc = (name: string, profileImageUrl?: string | null) => {
    const normalizedSrc = profileImageUrl?.trim();

    if (normalizedSrc) {
        return normalizedSrc;
    }

    return getFallbackUserProfileSrc(name);
};

const MobileOnboardingMemberCarousel = <T extends string = string>({
    items,
    value,
    onChange,
    className,
    emptyText = '선택할 수 있는 담당자가 없습니다.',
    noResultsText = '검색 결과가 없습니다.',
    ariaLabel = '담당자 선택',
    searchable = false,
    searchPlaceholder = '이름, 직책, 이메일로 검색',
}: MobileOnboardingMemberCarouselProps<T>) => {
    const swiperRef = useRef<SwiperCore | null>(null);
    const [searchValue, setSearchValue] = useState('');
    const deferredSearchValue = useDeferredValue(searchValue);
    const normalizedSearchValue = deferredSearchValue.trim().toLowerCase();
    const filteredItems = useMemo(() => {
        if (!normalizedSearchValue) {
            return items;
        }

        return items.filter((item) => {
            const searchSource = [
                item.name,
                item.eyebrow,
                item.description,
                item.searchText,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            return searchSource.includes(normalizedSearchValue);
        });
    }, [items, normalizedSearchValue]);
    const selectedIndex = useMemo(() => {
        const matchedIndex = filteredItems.findIndex((item) => item.value === value);

        if (matchedIndex >= 0) {
            return matchedIndex;
        }

        return 0;
    }, [filteredItems, value]);
    const [activeIndex, setActiveIndex] = useState(selectedIndex);

    useEffect(() => {
        setActiveIndex(selectedIndex);

        if (!swiperRef.current) return;
        if (swiperRef.current.activeIndex === selectedIndex) return;

        swiperRef.current.slideTo(selectedIndex, 360);
    }, [selectedIndex]);

    const handleSelect = (index: number) => {
        const targetItem = filteredItems[index];

        if (!targetItem || targetItem.disabled) return;

        setActiveIndex(index);

        if (targetItem.value !== value) {
            onChange(targetItem.value);
        }

        swiperRef.current?.slideTo(index, 360);
    };

    const showSearch = searchable && items.length > 1;

    if (items.length === 0) {
        return <div className={classNames(styles.Empty, className)}>{emptyText}</div>;
    }

    if (filteredItems.length === 0) {
        return (
            <div className={classNames(styles.Root, className)} data-multiple="false">
                {showSearch ? (
                    <label className={styles.SearchField}>
                        <span className={styles.SearchIcon}>
                            <FiSearch size={16} />
                        </span>
                        <input
                            type="search"
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            placeholder={searchPlaceholder}
                            aria-label={searchPlaceholder}
                        />
                        {searchValue ? (
                            <button
                                type="button"
                                className={styles.ClearButton}
                                onClick={() => setSearchValue('')}
                                aria-label="검색어 지우기"
                            >
                                <IoCloseOutline size={18} />
                            </button>
                        ) : null}
                    </label>
                ) : null}

                <div className={styles.Empty}>{noResultsText}</div>
            </div>
        );
    }

    if (filteredItems.length === 1) {
        const singleItem = filteredItems[0];

        return (
            <div className={classNames(styles.Root, className)} data-multiple="false">
                {showSearch ? (
                    <label className={styles.SearchField}>
                        <span className={styles.SearchIcon}>
                            <FiSearch size={16} />
                        </span>
                        <input
                            type="search"
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                            placeholder={searchPlaceholder}
                            aria-label={searchPlaceholder}
                        />
                        {searchValue ? (
                            <button
                                type="button"
                                className={styles.ClearButton}
                                onClick={() => setSearchValue('')}
                                aria-label="검색어 지우기"
                            >
                                <IoCloseOutline size={18} />
                            </button>
                        ) : null}
                    </label>
                ) : null}

                <button
                    type="button"
                    className={styles.Card}
                    data-active="true"
                    data-selected={singleItem.value === value ? 'true' : 'false'}
                    onClick={() => handleSelect(0)}
                    aria-label={singleItem.name}
                    aria-pressed={singleItem.value === value}
                    disabled={singleItem.disabled}
                >
                    <div className={styles.CardCopy}>
                        <span className={styles.Eyebrow}>{singleItem.eyebrow || '영업 담당'}</span>
                        <span className={styles.Name}>{singleItem.name}</span>
                        {singleItem.description ? <span className={styles.Description}>{singleItem.description}</span> : null}
                    </div>

                    <div className={styles.CardVisual}>
                        <MemberProfileAvatar
                            className={styles.Avatar}
                            name={singleItem.name}
                            src={resolveProfileImageSrc(singleItem.name, singleItem.profileImageUrl)}
                            size={76}
                            fontSize={24}
                        />
                    </div>
                </button>
            </div>
        );
    }

    return (
        <div className={classNames(styles.Root, className)} data-multiple="true">
            {showSearch ? (
                <label className={styles.SearchField}>
                    <span className={styles.SearchIcon}>
                        <FiSearch size={16} />
                    </span>
                    <input
                        type="search"
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                        placeholder={searchPlaceholder}
                        aria-label={searchPlaceholder}
                    />
                    {searchValue ? (
                        <button
                            type="button"
                            className={styles.ClearButton}
                            onClick={() => setSearchValue('')}
                            aria-label="검색어 지우기"
                        >
                            <IoCloseOutline size={18} />
                        </button>
                    ) : null}
                </label>
            ) : null}

            <Swiper
                className={styles.Swiper}
                slidesPerView={1.08}
                centeredSlides
                centeredSlidesBounds
                grabCursor
                slideToClickedSlide
                spaceBetween={14}
                speed={240}
                threshold={3}
                touchRatio={1.3}
                longSwipesRatio={0.12}
                longSwipesMs={180}
                shortSwipes
                resistanceRatio={0.18}
                watchSlidesProgress
                initialSlide={selectedIndex}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    setActiveIndex(swiper.activeIndex);
                }}
                onSlideChange={(swiper) => {
                    const nextItem = filteredItems[swiper.activeIndex];

                    setActiveIndex(swiper.activeIndex);

                    if (nextItem && nextItem.value !== value && !nextItem.disabled) {
                        onChange(nextItem.value);
                    }
                }}
                aria-label={ariaLabel}
            >
                {filteredItems.map((item, index) => (
                    <SwiperSlide key={item.value} className={styles.Slide}>
                        {({ isActive }) => (
                            <button
                                type="button"
                                className={styles.Card}
                                data-active={isActive ? 'true' : 'false'}
                                data-selected={item.value === value ? 'true' : 'false'}
                                onClick={() => handleSelect(index)}
                                aria-label={item.name}
                                aria-pressed={item.value === value}
                                disabled={item.disabled}
                            >
                                <div className={styles.CardCopy}>
                                    <span className={styles.Eyebrow}>{item.eyebrow || '영업 담당'}</span>
                                    <span className={styles.Name}>{item.name}</span>
                                    {item.description ? <span className={styles.Description}>{item.description}</span> : null}
                                </div>

                                <div className={styles.CardVisual}>
                                    <MemberProfileAvatar
                                        className={styles.Avatar}
                                        name={item.name}
                                        src={resolveProfileImageSrc(item.name, item.profileImageUrl)}
                                        size={76}
                                        fontSize={24}
                                    />
                                </div>
                            </button>
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className={styles.Indicators} aria-hidden="true">
                {filteredItems.map((item, index) => (
                    <span
                        key={item.value}
                        className={styles.Indicator}
                        data-active={index === activeIndex ? 'true' : 'false'}
                    />
                ))}
            </div>
        </div>
    );
};

export default MobileOnboardingMemberCarousel;
