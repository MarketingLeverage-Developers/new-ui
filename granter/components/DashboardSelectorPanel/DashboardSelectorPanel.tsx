import React from 'react';
import MemberProfileAvatar from '@/components/common/MemberProfileAvatar/MemberProfileAvatar';
import AmountListPanel from '../AmountListPanel/AmountListPanel';

export type DashboardSelectorPanelItem = {
    id?: string;
    name: string;
    value: number;
    profileSrc?: string;
    tooltipContent?: React.ReactNode;
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
                    amount: formatMetricValue(valueType, item.value),
                    amountTone:
                        valueType === 'count'
                            ? item.value === 0
                                ? 'subtle'
                                : 'default'
                            : item.value > 0
                              ? 'up'
                              : item.value < 0
                                ? 'default'
                                : 'subtle',
                    icon: <MemberProfileAvatar name={item.name} src={item.profileSrc} size={28} fontSize={11} />,
                    tooltipContent: item.tooltipContent ?? item.name,
                    tooltipSide: 'left' as const,
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
    const actionLabel = isAllSelected
        ? '선택 해제'
        : maxSelectionCount != null && selectableKeys.length > maxSelectionCount
          ? `상위 ${maxSelectionCount}개 선택`
          : '전체 선택';

    return (
        <AmountListPanel
            title={title}
            subtitle={maxSelectionCount == null ? undefined : `최대 ${maxSelectionCount}개 선택`}
            items={panelItems}
            selectedKeys={limitedSelectedIds}
            onSelect={(key) => {
                if (!selectedKeySet.has(key) && hasReachedSelectionLimit) {
                    return;
                }

                onSelect(key);
            }}
            actionLabel={actionLabel}
            onActionClick={() => onSelectAll(isAllSelected ? [] : selectAllKeys)}
            emptyText={emptyText}
            maxHeight={maxHeight}
        />
    );
};

export default DashboardSelectorPanel;
