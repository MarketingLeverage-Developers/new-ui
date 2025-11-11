// Content.tsx
import Dropdown, { useDropdown } from '@/shared/headless/Dropdown/Dropdown';
import React, { useEffect, useMemo } from 'react';
import Select, { useSelect } from '@/shared/headless/Select/Select';
import { useQuerySearch } from '@/shared/headless/QuerySearch/QuerySearch';
import { useHangulSearch } from '@/shared/hooks/client/useHangulSearch';
import styles from './Content.module.scss';
import type { SelectItem } from '@/shared/primitives/SearchSelect/SearchSelect';
import classNames from 'classnames';

export type SearchSelectItemProps<T extends SelectItem = SelectItem> = {
    item: T;
    isActive: boolean;
    onSelect: () => void;
};

type ContentProps<T extends SelectItem> = {
    children?: React.ReactElement;
};

// 기본 아이템
const DefaultItem = ({ item, onSelect }: SearchSelectItemProps) => (
    <div className={styles.Item} onClick={onSelect}>
        <span>{item.label}</span>
    </div>
);

const Content = <T extends SelectItem>({ children }: ContentProps<T>) => {
    const { open, isOpen, close } = useDropdown();
    const { query, data, setQuery } = useQuerySearch<SelectItem>();
    const { isActive, changeSelectValue } = useSelect();

    const { filtered } = useHangulSearch<SelectItem>(data, query, (it) => String(it.label ?? ''));

    const uniqueFiltered = useMemo(() => {
        const seen = new Set<string>();
        return filtered.filter((it) => {
            const id = String(it?.uuid ?? '');
            if (!id || seen.has(id)) return false;
            seen.add(id);
            return true;
        });
    }, [filtered]);

    const onSelectHandler = (item: SelectItem) => {
        if (isActive(item.uuid)) changeSelectValue('');
        else changeSelectValue(item.uuid);

        setQuery(String(item.label ?? ''));

        if (isOpen) close();
    };

    useEffect(() => {
        if (!isOpen && query.length > 1) open();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    const baseItemElement = children ?? <DefaultItem item={{} as any} isActive={false} onSelect={() => {}} />;

    const selectGapClassNames = classNames(styles.Select, {
        [styles.IsSelectChildren]: children ? true : false,
    });
    return (
        <Dropdown.Content matchTriggerWidth>
            <div className={styles.ContentWrapper}>
                <span className={styles.ContentTotal}>전체 ({filtered.length})</span>
                <div className={selectGapClassNames}>
                    {uniqueFiltered.length === 0 && <div className={styles.Empty}>결과가 없습니다</div>}
                    {uniqueFiltered.map((item) => {
                        const active = isActive(item.uuid);
                        const onSelect = () => onSelectHandler(item);

                        return (
                            <Select.Item key={item.uuid} value={item.uuid}>
                                {React.cloneElement(baseItemElement, {
                                    item,
                                    isActive: active,
                                    onSelect,
                                })}
                            </Select.Item>
                        );
                    })}
                </div>
            </div>
        </Dropdown.Content>
    );
};

export default Content;
