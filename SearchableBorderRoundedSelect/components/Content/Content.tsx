import React, { useMemo } from 'react';
import classNames from 'classnames';
import Dropdown from '../../../shared/headless/Dropdown/Dropdown';
import { useQuerySearch } from '../../../shared/headless/QuerySearch/QuerySearch';
import { useHangulSearch } from '../../../shared/hooks/client/useHangulSearch';
import SearchInput from '../../../SearchInput/SearchInput';
import { Item } from '../Item/Item';
import type { SearchableBorderRoundedSelectItem } from '../types';
import styles from './Content.module.scss';

type ContentProps<T extends SearchableBorderRoundedSelectItem> = Omit<
    React.ComponentProps<typeof Dropdown.Content>,
    'children'
> & {
    searchPlaceholder?: string;
    emptyText?: string;
    renderItem?: (item: T) => React.ReactNode;
};

export const Content = <T extends SearchableBorderRoundedSelectItem>({
    searchPlaceholder = '검색어를 입력해 주세요',
    emptyText = '검색 결과가 없습니다',
    renderItem,
    className,
    ...props
}: ContentProps<T>) => {
    const { query, data, setQuery } = useQuerySearch<T>();
    const { filtered } = useHangulSearch<T>(data, query, (item) => String(item.label ?? ''));

    const uniqueFiltered = useMemo(() => {
        const seen = new Set<string>();
        return filtered.filter((item) => {
            const id = String(item.uuid ?? '');
            if (!id || seen.has(id)) return false;
            seen.add(id);
            return true;
        });
    }, [filtered]);

    return (
        <Dropdown.Content {...props} className={classNames(styles.Content, className)}>
            <div className={styles.SearchWrapper}>
                <SearchInput
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    debounceMs={0}
                />
            </div>
            <div className={styles.List}>
                {uniqueFiltered.length === 0 ? (
                    <div className={styles.Empty}>{emptyText}</div>
                ) : (
                    uniqueFiltered.map((item) => (
                        <Item key={item.uuid} value={item.uuid}>
                            {renderItem ? renderItem(item) : item.label}
                        </Item>
                    ))
                )}
            </div>
        </Dropdown.Content>
    );
};
