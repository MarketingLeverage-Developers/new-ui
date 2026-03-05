import React, { type InputHTMLAttributes, useRef } from 'react';
import styles from './UnderlineSearch.module.scss';
import { HiMiniMagnifyingGlass } from 'react-icons/hi2';
import { FaCircleXmark } from 'react-icons/fa6';
import type { HexColor } from '../shared/types/css/HexColor';
import type { ThemeColorVar } from '../shared/types/css/ThemeColorTokens';
import type { CSSVariables } from '../shared/types/css/CSSVariables';

type UnderlineSearchProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'color'> & {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    color?: HexColor | ThemeColorVar;
};

const UnderlineSearch: React.FC<UnderlineSearchProps> = ({ value, onChange, color, ...props }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const cssVariables: CSSVariables = {
        '--main-color': color,
    };

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
        <div className={styles.UnderlineSearch} style={cssVariables}>
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
