import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './SearchInput.module.scss';
import { MdCancel } from 'react-icons/md';
import { CiSearch } from 'react-icons/ci';
import classNames from 'classnames';

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    fullWidth?: boolean;

    /** 디바운스 적용 시간(ms). 주지 않으면 기존처럼 즉시 onChange 호출 */
    debounceMs?: number;
};

const SearchInput = ({ value, onChange, fullWidth, debounceMs = 300, ...props }: SearchInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [internalValue, setInternalValue] = useState<string>(String(value ?? ''));

    const searchInputClassName = classNames(styles.SearchInputWrapper, {
        [styles.FullWidth]: fullWidth,
    });

    const isDebounceEnabled = typeof debounceMs === 'number' && debounceMs > 0;

    const createChangeEvent = useMemo(
        () =>
            (nextValue: string): React.ChangeEvent<HTMLInputElement> =>
                ({ target: { value: nextValue } } as unknown as React.ChangeEvent<HTMLInputElement>),
        []
    );

    // 외부 value 변경 시 내부 값 동기화
    useEffect(() => {
        const next = String(value ?? '');
        if (next !== internalValue) {
            setInternalValue(next);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    // 언마운트 시 타이머 정리
    useEffect(
        () => () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        },
        []
    );

    const emitChange = (nextValue: string) => {
        if (!onChange) return;
        onChange(createChangeEvent(nextValue));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextValue = e.target.value;

        // 입력 값은 즉시 반영(타이핑 UX 유지)
        setInternalValue(nextValue);

        // 디바운스가 없으면 기존처럼 즉시 호출
        if (!isDebounceEnabled) {
            emitChange(nextValue);
            return;
        }

        // 디바운스가 있으면 일정 시간 후에만 호출
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            emitChange(nextValue);
        }, debounceMs);
    };

    const clearHandler = () => {
        const nextValue = '';

        // pending debounce 취소
        if (timerRef.current) clearTimeout(timerRef.current);

        // UI 즉시 반영
        setInternalValue(nextValue);

        // clear는 보통 즉시 반영되는 게 자연스러워서 즉시 호출
        emitChange(nextValue);

        if (inputRef.current) {
            inputRef.current.value = nextValue;
            inputRef.current.focus();
        }
    };

    return (
        <div className={searchInputClassName}>
            <input ref={inputRef} value={internalValue} onChange={handleChange} {...props} />
            <div className={styles.SearchIcons}>
                <CiSearch />
            </div>
            {String(internalValue ?? '').length > 0 && (
                <div className={styles.CancelIcons} onClick={clearHandler}>
                    <MdCancel style={{ cursor: 'pointer' }} />
                </div>
            )}
        </div>
    );
};

export default SearchInput;
