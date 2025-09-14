import Dropdown, { useDropdown } from '@/shared/headless/Dropdown/Dropdown';
import React, { useEffect } from 'react';
import styles from './Select.module.scss';
import ManySelect from '@/shared/headless/ManySelect/ManySelect';
import SearchInput from '@/shared/primitives/SearchInput/SearchInput';
import { useSelect } from '@/shared/headless/Select/Select';
import { useQuerySearch } from '@/shared/headless/QuerySearch/QuerySearch';
import type { SelectItem } from '../../SearchSelect';
import { useHangulSearch } from '@/shared/hooks/client/useHangulSearch';

const Select = () => {
    const { open, isOpen, close } = useDropdown();
    const { query, data, setQuery } = useQuerySearch<SelectItem>();
    const { isActive, changeSelectValue } = useSelect();

    const { filtered } = useHangulSearch<SelectItem>(data, query, (it) => String(it.label ?? ''));

    const onSelectHandler = (uid: string) => {
        if (isActive(uid)) changeSelectValue('');
        else changeSelectValue(uid);
        if (isOpen) close();
    };

    // 모달이 닫힌 상태인데 query 값 갱신되면
    useEffect(() => {
        if (!isOpen && query.length > 1) open();
    }, [query]);

    return (
        <Dropdown.Content matchTriggerWidth>
            <div className={styles.SelectWrapper}>
                <SearchInput
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={`검색어를 입력하세요`}
                />
                <div className={styles.Select}>
                    {filtered.length === 0 && <div className={styles.Empty}>결과가 없습니다</div>}
                    {filtered.map((item) => (
                        <ManySelect.Item key={item.uid} value={item.uid}>
                            <div className={styles.Item} onClick={() => onSelectHandler(item.uid)}>
                                <span>{item.label}</span>
                            </div>
                        </ManySelect.Item>
                    ))}
                </div>
            </div>
        </Dropdown.Content>
    );
};

export default Select;

// const indexed = useMemo(
//     () =>
//         data.map((it) => ({
//             ...it,
//             _idx: buildHangulIndex(String(it.label ?? '')),
//         })),
//     [data]
// );

// const filtered = useMemo(() => {
//     const qRaw = (query ?? '').trim();
//     if (!qRaw) return indexed;

//     const q = qRaw.toLowerCase();
//     const qJamo = disassembleHangul(q); // 예) '맠' -> 'ㅁㅏㅋ', '서' -> 'ㅅㅓ'
//     const qCho = choseongOnly(q).replace(/\s+/g, ''); // 예) '선택값' -> 'ㅅㅌㄱ'
//     const onlyConsonants = isConsonantOnly(q); // 예) 'ㅅ' -> true, '서','맠' -> false

//     return indexed.filter(
//         ({ _idx }) =>
//             // 1) 일반 포함 검색 (예: '마' -> '마케팅')
//             _idx.norm.includes(q) ||
//             // 2) 자음만 입력이 아닐 때는 자모 매칭을 항상 수행
//             //    (예: '맠' -> '마케..', '서' -> '선..')
//             (!onlyConsonants && _idx.jamo.includes(qJamo)) ||
//             // 3) 자음만 입력 시 초성 매칭 (예: 'ㅅ' -> '선택된','암사슴')
//             (onlyConsonants && _idx.cho.includes(qCho))
//     );
// }, [indexed, query]);
