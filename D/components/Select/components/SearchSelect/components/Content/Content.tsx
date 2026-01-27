import Dropdown, { useDropdown } from '@/shared/headless/Dropdown/Dropdown';
import React, { useEffect, useMemo } from 'react';
import styles from './Content.module.scss';
import ManySelect from '@/shared/headless/ManySelect/ManySelect';
import SearchInput from '@/shared/primitives/SearchInput/SearchInput';
import { useSelect } from '@/shared/headless/Select/Select';
import { useQuerySearch } from '@/shared/headless/QuerySearch/QuerySearch';
import type { SelectItem } from '../../../SearchSelect.types';
import { useHangulSearch } from '@/shared/hooks/client/useHangulSearch';

const SearchSelectContent: React.FC = () => {
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

    const onSelectHandler = (uid: string) => {
        if (isActive(uid)) changeSelectValue('');
        else changeSelectValue(uid);
        if (isOpen) close();
    };

    useEffect(() => {
        if (!isOpen && query.length > 1) open();
    }, [isOpen, open, query]);

    return (
        <Dropdown.Content matchTriggerWidth>
            <div className={styles.SelectWrapper}>
                <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`검색어를 입력하세요`} />
                <div className={styles.Select}>
                    {uniqueFiltered.length === 0 && <div className={styles.Empty}>결과가 없습니다</div>}
                    {uniqueFiltered.map((item) => (
                        <ManySelect.Item key={item.uuid} value={item.uuid}>
                            <div className={styles.Item} onClick={() => onSelectHandler(item.uuid)}>
                                <span>{item.label}</span>
                            </div>
                        </ManySelect.Item>
                    ))}
                </div>
            </div>
        </Dropdown.Content>
    );
};

export default SearchSelectContent;
