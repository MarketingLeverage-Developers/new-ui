import React from 'react';
import classNames from 'classnames';
import Text from '../Text/Text';
import styles from './SelectableList.module.scss';

export type SelectableListItemId = string | number;

export type SelectableListItem = {
    id: SelectableListItemId;
    title: React.ReactNode;
    description?: React.ReactNode;
    meta?: React.ReactNode;
    disabled?: boolean;
};

export type SelectableListProps = {
    items: SelectableListItem[];
    selectedId?: SelectableListItemId | null;
    onSelect?: (id: SelectableListItemId) => void;
    emptyText?: React.ReactNode;
    className?: string;
};

const SelectableList = ({
    items,
    selectedId,
    onSelect,
    emptyText = '표시할 항목이 없습니다.',
    className,
}: SelectableListProps) => {
    if (!items.length) {
        return (
            <div className={classNames(styles.Root, className)}>
                <div className={styles.Empty}>
                    <Text size="sm" tone="muted" weight="medium">
                        {emptyText}
                    </Text>
                </div>
            </div>
        );
    }

    return (
        <div className={classNames(styles.Root, className)}>
            {items.map((item) => {
                const active = String(item.id) === String(selectedId);

                return (
                    <button
                        key={String(item.id)}
                        type="button"
                        className={styles.Item}
                        data-active={active ? 'true' : 'false'}
                        disabled={item.disabled}
                        onClick={() => onSelect?.(item.id)}
                    >
                        <span className={styles.ItemText}>
                            <Text size="sm" weight="semibold" tone="default" className={styles.Title}>
                                {item.title}
                            </Text>
                            {item.description ? (
                                <Text size="xs" weight="medium" tone="muted" className={styles.Description}>
                                    {item.description}
                                </Text>
                            ) : null}
                        </span>
                        {item.meta ? (
                            <Text size="xs" weight="semibold" tone="up" className={styles.Meta}>
                                {item.meta}
                            </Text>
                        ) : null}
                    </button>
                );
            })}
        </div>
    );
};

export default SelectableList;
