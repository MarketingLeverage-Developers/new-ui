import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoCloseOutline } from 'react-icons/io5';
import PlainButton from '../Button/PlainButton';
import styles from './SearchInput.module.scss';

export type SearchInputWidthPreset = 'auto' | 'coupang';

export type SearchInputProps = {
    value: string;
    onValueChange: (next: string) => void;
    placeholder: string;
    ariaLabel?: string;
    widthPreset?: SearchInputWidthPreset;
};

const SearchInput = ({
    value,
    onValueChange,
    placeholder,
    ariaLabel = placeholder,
    widthPreset = 'auto',
}: SearchInputProps) => {
    const [draftValue, setDraftValue] = React.useState(value);
    const isComposingRef = React.useRef(false);

    React.useEffect(() => {
        if (isComposingRef.current) return;
        setDraftValue(value);
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const next = event.target.value;
        setDraftValue(next);
        if (!isComposingRef.current) {
            onValueChange(next);
        }
    };

    const handleCompositionStart = () => {
        isComposingRef.current = true;
    };

    const handleCompositionEnd = (event: React.CompositionEvent<HTMLInputElement>) => {
        isComposingRef.current = false;
        const next = event.currentTarget.value;
        setDraftValue(next);
        onValueChange(next);
    };

    const handleClear = () => {
        setDraftValue('');
        onValueChange('');
    };

    return (
        <div className={styles.SearchInput} data-width-preset={widthPreset}>
            <FiSearch size={16} />
            <input
                type="text"
                value={draftValue}
                placeholder={placeholder}
                aria-label={ariaLabel}
                onChange={handleChange}
                onCompositionStart={handleCompositionStart}
                onCompositionEnd={handleCompositionEnd}
            />
            <PlainButton className={styles.ClearButton} aria-label="입력 지우기" onClick={handleClear}>
                <IoCloseOutline size={16} />
            </PlainButton>
        </div>
    );
};

export default SearchInput;
