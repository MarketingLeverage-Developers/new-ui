import Dropdown, { useDropdown } from '@/shared/headless/Dropdown/Dropdown';
import React, { useEffect, useMemo } from 'react';
import Select, { useSelect } from '@/shared/headless/Select/Select';
import { useQuerySearch } from '@/shared/headless/QuerySearch/QuerySearch';
import { useHangulSearch } from '@/shared/hooks/client/useHangulSearch';
import styles from './Content.module.scss';
import type { SelectItem } from '@/shared/primitives/SearchSelect/SearchSelect';

// TODO: 디자인 수정해야함
const Content = () => {
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
        // 선택 토글
        if (isActive(item.uuid)) changeSelectValue('');
        else changeSelectValue(item.uuid);
        setQuery(String(item.label ?? ''));

        if (isOpen) close();
    };

    useEffect(() => {
        if (!isOpen && query.length > 1) open();
    }, [query]);

    return (
        <Dropdown.Content matchTriggerWidth>
            <div className={styles.ContentWrapper}>
                <div className={styles.Select}>
                    {uniqueFiltered.length === 0 && <div className={styles.Empty}>결과가 없습니다</div>}
                    {uniqueFiltered.map((item) => (
                        <Select.Item key={item.uuid} value={item.uuid}>
                            <div className={styles.Item} onClick={() => onSelectHandler(item)}>
                                <span>{item.label}</span>
                            </div>
                        </Select.Item>
                    ))}
                </div>
            </div>
        </Dropdown.Content>
    );
};

export default Content;
