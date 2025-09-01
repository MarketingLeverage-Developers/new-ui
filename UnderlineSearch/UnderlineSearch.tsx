import React, { type InputHTMLAttributes, useRef } from 'react';
import styles from './UnderlineSearch.module.scss';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';
import { FaCircleXmark } from 'react-icons/fa6';

type UnderlineSearchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> & {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const UnderlineSearch: React.FC<UnderlineSearchProps> = ({ value, onChange, ...props }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClear = () => {
        const el = inputRef.current;
        if (!el) return;
        const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
        setter?.call(el, '');
        const ev = new Event('input', { bubbles: true });
        el.dispatchEvent(ev);
        el.focus();
    };

    return (
        <div className={styles.UnderlineSearch}>
            <HiMiniMagnifyingGlass className={styles.MagnifyIcon} />
            <input ref={inputRef} value={value} onChange={onChange} {...props} />

            <FaCircleXmark
                onClick={handleClear}
                className={styles.XMarkIcon}
                style={{ visibility: value && value.length > 0 ? 'visible' : 'hidden' }}
            />
        </div>
    );
};

export default UnderlineSearch;
