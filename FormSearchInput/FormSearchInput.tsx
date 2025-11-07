import React, { useRef } from 'react';
import styles from './FormSearchInput.module.scss';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

type FormSearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    padding?: PaddingSize;
};

const FormSearchInput = ({ value, onChange, padding = { x: 16, y: 14 }, ...props }: FormSearchInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const wapperCssVariables: CSSVariables = {
        '--padding': toCssPadding(padding),
    };

    return (
        <div className={styles.SearchInputWrapper} style={{ ...wapperCssVariables }}>
            <input ref={inputRef} value={value} onChange={onChange} {...props} />
            <div className={styles.SearchIcons}>
                <HiOutlineMagnifyingGlass />
            </div>
        </div>
    );
};

export default FormSearchInput;
