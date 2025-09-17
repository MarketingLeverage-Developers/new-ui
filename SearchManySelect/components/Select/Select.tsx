import Dropdown, { useDropdown } from '@/shared/headless/Dropdown/Dropdown';
import React, { useEffect } from 'react';
import styles from './Select.module.scss';
import ManySelect, { useManySelect } from '@/shared/headless/ManySelect/ManySelect';
import { FaCheck } from 'react-icons/fa';
import classNames from 'classnames';
import { useQuerySearch } from '@/shared/headless/QuerySearch/QuerySearch';
import type { SelectItem } from '../../SearchManySelect';
import { useHangulSearch } from '@/shared/hooks/client/useHangulSearch';

const Select = () => {
    const { open, isOpen } = useDropdown();
    const { query, data } = useQuerySearch<SelectItem>();
    const { isChecked, toggleManySelectValue } = useManySelect();

    const { filtered } = useHangulSearch<SelectItem>(data, query, (it) => String(it.label ?? ''));

    const checkBoxClassName = (uid: string) =>
        classNames(styles.CheckBox, {
            [styles.Active]: isChecked(uid),
        });

    // 모달이 닫힌 상태인데 query 값 갱신되면
    useEffect(() => {
        if (!isOpen && query.length > 1) open();
    }, [query]);

    return (
        <Dropdown.Content matchTriggerWidth>
            <div className={styles.SelectWrapper}>
                <div className={styles.Select}>
                    {filtered.length === 0 && <div className={styles.Empty}>결과가 없습니다</div>}
                    {filtered.map((item) => (
                        <ManySelect.Item key={item.uid} value={item.uid}>
                            <div className={styles.Item} onClick={() => toggleManySelectValue(item.uid)}>
                                <div className={checkBoxClassName(item.uid)}>{isChecked(item.uid) && <FaCheck />}</div>
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
