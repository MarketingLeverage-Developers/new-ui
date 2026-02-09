import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './SearchInput.module.scss';
import { MdCancel } from 'react-icons/md';
import { CiSearch } from 'react-icons/ci';
import classNames from 'classnames';
import type { InputCommonProps } from '../../Input';

export type SearchInputActionType = 'none' | 'button';

export type SearchInputProps = InputCommonProps & {
    fullWidth?: boolean;
    debounceMs?: number;
    actionType?: SearchInputActionType;
    actionButtonText?: string;
    onActionClick?: (value: string) => void;
    showActionOnlyWhenHasValue?: boolean;
};

const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChange,
    fullWidth,
    debounceMs = 300,
    actionType = 'none',
    actionButtonText = '검색',
    onActionClick,
    showActionOnlyWhenHasValue = true,
    ...props
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [internalValue, setInternalValue] = useState<string>(String(value ?? ''));

    const isDebounceEnabled = typeof debounceMs === 'number' && debounceMs > 0;

    const createChangeEvent = useMemo(
        () =>
            (nextValue: string): React.ChangeEvent<HTMLInputElement> =>
                ({ target: { value: nextValue } }) as unknown as React.ChangeEvent<HTMLInputElement>,
        []
    );

    useEffect(() => {
        const next = String(value ?? '');
        setInternalValue((prev) => (prev === next ? prev : next));
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
