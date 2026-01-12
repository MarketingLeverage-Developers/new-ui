import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './SearchInput.module.scss';
import { MdCancel } from 'react-icons/md';
import { CiSearch } from 'react-icons/ci';
import classNames from 'classnames';

type SearchInputActionType = 'none' | 'button';

type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    fullWidth?: boolean;
    debounceMs?: number;

    actionType?: SearchInputActionType;
    actionButtonText?: string;
    onActionClick?: (value: string) => void;
    showActionOnlyWhenHasValue?: boolean;
};

const SearchInput = ({
    value,
    onChange,
    fullWidth,
    debounceMs = 300,
    actionType = 'none',
    actionButtonText = '검색',
    onActionClick,
    showActionOnlyWhenHasValue = true,
    ...props
}: SearchInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [internalValue, setInternalValue] = useState<string>(String(value ?? ''));

    const isDebounceEnabled = typeof debounceMs === 'number' && debounceMs > 0;

    const createChangeEvent = useMemo(
        () =>
            (nextValue: string): React.ChangeEvent<HTMLInputElement> =>
                ({ target: { value: nextValue } } as unknown as React.ChangeEvent<HTMLInputElement>),
        []
    );

    useEffect(() => {
        const next = String(value ?? '');
        if (next !== internalValue) setInternalValue(next);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

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

        setInternalValue(nextValue);

        if (!isDebounceEnabled) {
            emitChange(nextValue);
            return;
        }

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            emitChange(nextValue);
        }, debounceMs);
    };

    const clearHandler = () => {
        const nextValue = '';

        if (timerRef.current) clearTimeout(timerRef.current);

        setInternalValue(nextValue);
        emitChange(nextValue);

        if (inputRef.current) {
            inputRef.current.value = nextValue;
            inputRef.current.focus();
        }
    };

    const handleActionClick = () => {
        if (!onActionClick) return;
        onActionClick(String(internalValue ?? ''));
    };

    const hasValue = String(internalValue ?? '').length > 0;

    const isActionButtonType = actionType === 'button';
    const shouldShowActionButton = isActionButtonType && (showActionOnlyWhenHasValue ? hasValue : true);
    const shouldShowCancel = !isActionButtonType && hasValue;

    const showRightContent = shouldShowActionButton || shouldShowCancel;

    const searchInputClassName = classNames(styles.SearchInputWrapper, {
        [styles.FullWidth]: fullWidth,
    });

    const rightSlotClassName = classNames(styles.RightSlot, {
        [styles.RightSlotHidden]: !showRightContent,
    });

    return (
        <div className={searchInputClassName}>
            <div className={styles.SearchIcons}>
                <CiSearch />
            </div>

            <input ref={inputRef} value={internalValue} onChange={handleChange} {...props} />

            {/* ✅ 항상 렌더링해서 폭이 절대 변하지 않게 */}
            <div className={rightSlotClassName}>
                {shouldShowActionButton && (
                    <button type="button" className={styles.ActionButton} onClick={handleActionClick}>
                        {actionButtonText}
                    </button>
                )}

                {shouldShowCancel && (
                    <button type="button" className={styles.CancelButton} onClick={clearHandler}>
                        <MdCancel />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchInput;
