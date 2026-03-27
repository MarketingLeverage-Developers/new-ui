import React from 'react';
import MemberProfileAvatar from '@/components/common/MemberProfileAvatar/MemberProfileAvatar';
import LightButton from '../Button/LightButton';
import PlainButton from '../Button/PlainButton';
import Text from '../Text/Text';
import Tooltip from '../Tooltip/Tooltip';
import styles from './DashboardSelectorPanel.module.scss';

export type DashboardSelectorPanelItem = {
    id?: string;
    name: string;
    value: number;
    profileSrc?: string;
    tooltipContent?: React.ReactNode;
    displayValue?: React.ReactNode;
    valueTone?: 'default' | 'up' | 'down' | 'subtle';
    amountLines?: Array<{
        value: React.ReactNode;
        tone?: 'default' | 'up' | 'down' | 'subtle';
    }>;
};

export type DashboardSelectorPanelSortMode = 'name' | 'valueDesc';
export type DashboardSelectorPanelValueType = 'amount' | 'count';

export type DashboardSelectorPanelProps = {
    title: React.ReactNode;
    items: DashboardSelectorPanelItem[];
    selectedIds: string[];
    onSelect: (id: string) => void;
    onSelectAll: (ids: string[]) => void;
    sortMode?: DashboardSelectorPanelSortMode;
    valueType?: DashboardSelectorPanelValueType;
    maxSelectionCount?: number | null;
    emptyText?: React.ReactNode;
    maxHeight?: number | string;
};

const DEFAULT_MAX_SELECTION_COUNT = 3;

const normalizeSelectableIds = (values: string[]) =>
    Array.from(new Set(values.map((value) => value.trim()).filter((value) => value.length > 0)));

const limitSelectableIdsByMax = (
    values: string[],
    maxSelectionCount: number | null = DEFAULT_MAX_SELECTION_COUNT
) => {
    const normalizedIds = normalizeSelectableIds(values);

    if (maxSelectionCount == null) {
        return normalizedIds;
    }

    return normalizedIds.slice(0, maxSelectionCount);
};

const formatMetricValue = (valueType: DashboardSelectorPanelValueType, value: number) => {
    if (valueType === 'count') {
        return `${value.toLocaleString('ko-KR')}개`;
    }

    const roundedValue = Math.round(value);
    const formattedValue = `${Math.abs(roundedValue).toLocaleString('ko-KR')}원`;

    if (roundedValue > 0) return `+${formattedValue}`;
    if (roundedValue < 0) return `-${formattedValue}`;
    return '0원';
};

const DashboardSelectorPanel = ({
    title,
    items,
    selectedIds,
    onSelect,
    onSelectAll,
    sortMode = 'valueDesc',
    valueType = 'amount',
    maxSelectionCount = DEFAULT_MAX_SELECTION_COUNT,
    emptyText = '집계된 데이터가 없습니다.',
    maxHeight = '100%',
}: DashboardSelectorPanelProps) => {
    const sortedItems = React.useMemo(
        () =>
            [...items].sort((a, b) => {
                if (sortMode === 'valueDesc') {
                    return b.value - a.value || a.name.localeCompare(b.name, 'ko-KR');
                }

                return a.name.localeCompare(b.name, 'ko-KR', {
                    sensitivity: 'base',
                });
            }),
        [items, sortMode]
    );

    const limitedSelectedIds = React.useMemo(
        () => limitSelectableIdsByMax(selectedIds, maxSelectionCount),
        [maxSelectionCount, selectedIds]
    );
    const selectedKeySet = React.useMemo(() => new Set(limitedSelectedIds), [limitedSelectedIds]);
    const hasSelectionLimit = maxSelectionCount != null;
    const hasReachedSelectionLimit =
        hasSelectionLimit && limitedSelectedIds.length >= maxSelectionCount;

    const panelItems = React.useMemo(
        () =>
            sortedItems.map((item, index) => {
                const hasId = typeof item.id === 'string' && item.id.length > 0;
                const key = hasId ? (item.id as string) : `${item.name}-${index}`;
                const isSelected = selectedKeySet.has(key);

                return {
                    key,
                    label: item.name,
                    amount: item.displayValue ?? formatMetricValue(valueType, item.value),
                    amountLines: item.amountLines,
                    amountTone:
                        item.valueTone ??
                        (valueType === 'count'
                            ? item.value === 0
                                ? 'subtle'
                                : 'default'
                            : item.value > 0
                              ? 'up'
                              : item.value < 0
                                ? 'default'
                                : 'subtle'),
                    icon: (
                        <MemberProfileAvatar
                            name={item.name}
                            src={item.profileSrc}
                            size={32}
                            fontSize={11}
                        />
                    ),
                    tooltipContent: item.tooltipContent ?? item.name,
                    disabled: !hasId || (hasReachedSelectionLimit && !isSelected),
                };
            }),
        [hasReachedSelectionLimit, selectedKeySet, sortedItems, valueType]
    );

    const selectableKeys = React.useMemo(
        () =>
            sortedItems.flatMap((item) =>
                typeof item.id === 'string' && item.id.length > 0 ? [item.id] : []
            ),
        [sortedItems]
    );
    const isAllSelected =
        selectableKeys.length > 0 && selectableKeys.every((key) => selectedKeySet.has(key));
    const selectAllKeys =
        maxSelectionCount == null ? selectableKeys : selectableKeys.slice(0, maxSelectionCount);
    const actionLabel =
        isAllSelected
            ? '선택 해제'
            : maxSelectionCount != null && selectableKeys.length > maxSelectionCount
              ? `상위 ${maxSelectionCount}개 선택`
              : '전체 선택';
    const bodyStyle = typeof maxHeight !== 'undefined' ? { maxHeight } : undefined;

    return (
        <section className={styles.Panel}>
            <header className={styles.Header}>
                <div className={styles.TitleWrap}>
                    <Text as="h3" className={styles.Title} weight="semibold">
                        {title}
                    </Text>
                    {maxSelectionCount != null ? (
                        <Text as="span" className={styles.Subtitle} tone="muted">
                            {`최대 ${maxSelectionCount}개 선택`}
                        </Text>
                    ) : null}
                </div>

                <LightButton size="sm" className={styles.ActionButton} onClick={() => onSelectAll(isAllSelected ? [] : selectAllKeys)}>
                    {actionLabel}
                </LightButton>
            </header>

            <div className={styles.Body} style={bodyStyle}>
                {panelItems.length > 0 ? (
                    <div className={styles.List}>
                        {panelItems.map((item) => {
                            const isSelected = selectedKeySet.has(item.key);
                            const isClickable = !item.disabled;

                            const content = (
                                <>
                                    <span className={styles.ItemLeft}>
                                        <span className={styles.IconWrap}>{item.icon}</span>
                                        <span className={styles.LabelWrap}>
                                            <Text as="span" className={styles.Label} tone={item.disabled ? 'subtle' : 'default'}>
                                                {item.label}
                                            </Text>
                                        </span>
                                    </span>
                                    {item.amountLines && item.amountLines.length > 0 ? (
                                        <span className={styles.AmountLines}>
                                            {item.amountLines.map((line, index) => (
                                                <Text
                                                    key={`${item.key}-${index}`}
                                                    as="span"
                                                    className={styles.AmountLine}
                                                    tone="inherit"
                                                    weight="regular"
                                                    data-tone={line.tone ?? 'default'}
                                                >
                                                    {line.value}
                                                </Text>
                                            ))}
                                        </span>
                                    ) : (
                                        <Text
                                            as="span"
                                            className={styles.Amount}
                                            tone="inherit"
                                            weight="regular"
                                            data-tone={item.amountTone ?? 'default'}
                                        >
                                            {item.amount}
                                        </Text>
                                    )}
                                </>
                            );

                            const row = isClickable ? (
                                <PlainButton
                                    className={styles.Item}
                                    data-selected={isSelected ? 'true' : 'false'}
                                    data-clickable="true"
                                    onClick={() => {
                                        if (!selectedKeySet.has(item.key) && hasReachedSelectionLimit) {
                                            return;
                                        }

                                        onSelect(item.key);
                                    }}
                                >
                                    {content}
                                </PlainButton>
                            ) : (
                                <div
                                    className={styles.Item}
                                    data-selected={isSelected ? 'true' : 'false'}
                                    data-clickable="false"
                                >
                                    {content}
                                </div>
                            );

                            if (item.tooltipContent) {
                                return (
                                    <Tooltip key={item.key} content={item.tooltipContent} side="left" align="center">
                                        {row}
                                    </Tooltip>
                                );
                            }

                            return React.cloneElement(row, { key: item.key });
                        })}
                    </div>
                ) : (
                    <Text as="p" className={styles.Empty} tone="subtle">
                        {emptyText}
                    </Text>
                )}
            </div>
        </section>
    );
};

export default DashboardSelectorPanel;
