import React from 'react';
import classNames from 'classnames';
import LightButton from '../Button/LightButton';
import PlainButton from '../Button/PlainButton';
import Text from '../Text/Text';
import Tooltip from '../Tooltip/Tooltip';
import type { TooltipAlign, TooltipSide } from '../Tooltip/Tooltip';
import styles from './AmountListPanel.module.scss';

const noop = () => undefined;

export type AmountListPanelItemTone = 'default' | 'up' | 'down' | 'subtle';

export type AmountListPanelItem = {
    key: string;
    label: React.ReactNode;
    amount: React.ReactNode;
    amountTone?: AmountListPanelItemTone;
    meta?: React.ReactNode;
    iconSrc?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    tooltipContent?: React.ReactNode;
    tooltipSide?: TooltipSide;
    tooltipAlign?: TooltipAlign;
};

export type AmountListPanelTab = {
    key: string;
    label: React.ReactNode;
};

export type AmountListPanelProps = {
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    tabs?: AmountListPanelTab[];
    activeTabKey?: string;
    onTabChange?: (next: string) => void;
    items: AmountListPanelItem[];
    selectedKeys?: string[];
    onSelect?: (key: string) => void;
    actionLabel?: React.ReactNode;
    onActionClick?: () => void;
    emptyText?: React.ReactNode;
    maxHeight?: number | string;
    className?: string;
};

const AmountListPanel = ({
    title,
    subtitle,
    tabs,
    activeTabKey,
    onTabChange,
    items,
    selectedKeys = [],
    onSelect,
    actionLabel,
    onActionClick = noop,
    emptyText = '표시할 항목이 없습니다.',
    maxHeight,
    className,
}: AmountListPanelProps) => {
    const selectedKeySet = React.useMemo(() => new Set(selectedKeys), [selectedKeys]);
    const bodyStyle = typeof maxHeight !== 'undefined' ? { maxHeight } : undefined;

    return (
        <section className={classNames(styles.Panel, className)}>
            <header className={styles.Header}>
                {tabs && tabs.length > 0 ? (
                    <div className={styles.Tabs}>
                        {tabs.map((tab) => {
                            const isActive = tab.key === activeTabKey;
                            return (
                                <PlainButton
                                    key={tab.key}
                                    className={styles.TabButton}
                                    data-active={isActive ? 'true' : 'false'}
                                    onClick={() => onTabChange?.(tab.key)}
                                >
                                    {tab.label}
                                </PlainButton>
                            );
                        })}
                    </div>
                ) : (
                    <div className={styles.TitleWrap}>
                        <Text as="h3" className={styles.Title} weight="semibold">
                            {title}
                        </Text>
                        {subtitle ? (
                            <Text as="span" className={styles.Subtitle} tone="muted">
                                {subtitle}
                            </Text>
                        ) : null}
                    </div>
                )}

                {actionLabel ? (
                    <LightButton size="sm" className={styles.ActionButton} onClick={onActionClick}>
                        {actionLabel}
                    </LightButton>
                ) : null}
            </header>

            <div className={styles.Body} style={bodyStyle}>
                {items.length > 0 ? (
                    <div className={styles.List}>
                        {items.map((item) => {
                            const isSelected = selectedKeySet.has(item.key);
                            const isClickable = !item.disabled && Boolean(onSelect);

                            const content = (
                                <>
                                    <span className={styles.ItemLeft}>
                                        {item.iconSrc ? (
                                            <span className={styles.IconWrap}>
                                                <img src={item.iconSrc} alt="" />
                                            </span>
                                        ) : item.icon ? (
                                            <span className={styles.IconWrap}>{item.icon}</span>
                                        ) : null}
                                        <span className={styles.LabelWrap}>
                                            <Text as="span" className={styles.Label} tone={item.disabled ? 'subtle' : 'default'}>
                                                {item.label}
                                            </Text>
                                            {item.meta ? (
                                                <Text as="span" className={styles.Meta} tone="subtle" weight="medium">
                                                    {item.meta}
                                                </Text>
                                            ) : null}
                                        </span>
                                    </span>
                                    <Text
                                        as="span"
                                        className={styles.Amount}
                                        tone="inherit"
                                        weight="medium"
                                        data-tone={item.amountTone ?? 'default'}
                                    >
                                        {item.amount}
                                    </Text>
                                </>
                            );

                            if (isClickable) {
                                const row = (
                                    <PlainButton
                                        className={styles.Item}
                                        data-selected={isSelected ? 'true' : 'false'}
                                        data-clickable="true"
                                        onClick={() => onSelect?.(item.key)}
                                    >
                                        {content}
                                    </PlainButton>
                                );

                                if (item.tooltipContent) {
                                    return (
                                        <Tooltip
                                            key={item.key}
                                            content={item.tooltipContent}
                                            side={item.tooltipSide ?? 'left'}
                                            align={item.tooltipAlign ?? 'center'}
                                        >
                                            {row}
                                        </Tooltip>
                                    );
                                }

                                return (
                                    <PlainButton key={item.key} className={styles.Item} data-selected={isSelected ? 'true' : 'false'} data-clickable="true" onClick={() => onSelect?.(item.key)}>
                                        {content}
                                    </PlainButton>
                                );
                            }

                            const row = (
                                <div className={styles.Item} data-selected={isSelected ? 'true' : 'false'} data-clickable="false">
                                    {content}
                                </div>
                            );

                            if (item.tooltipContent) {
                                return (
                                    <Tooltip
                                        key={item.key}
                                        content={item.tooltipContent}
                                        side={item.tooltipSide ?? 'left'}
                                        align={item.tooltipAlign ?? 'center'}
                                    >
                                        {row}
                                    </Tooltip>
                                );
                            }

                            return (
                                <div key={item.key} className={styles.Item} data-selected={isSelected ? 'true' : 'false'} data-clickable="false">
                                    {content}
                                </div>
                            );
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

export default AmountListPanel;
