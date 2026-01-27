import React from 'react';
import classNames from 'classnames';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import { useSelect } from '@/shared/headless/Select/Select';
import { MdKeyboardArrowDown } from 'react-icons/md';
import styles from './BaseSelectDisplay.module.scss';

export type BaseSelectDisplayProps = {
    placeholder?: React.ReactNode;
    className?: string;
    render?: (value: string) => React.ReactNode;
};

const BaseSelectDisplay: React.FC<BaseSelectDisplayProps> = (props) => {
    const { placeholder = '선택', className, render } = props;
    const { selectValue } = useSelect();

    return (
        <Dropdown.Trigger className={classNames(styles.Display, className)}>
            <span>
                {selectValue ? (render ? render(selectValue) : selectValue) : (
                    <span className={styles.Placeholder}>{placeholder}</span>
                )}
            </span>
            <MdKeyboardArrowDown className={styles.Arrow} aria-hidden />
        </Dropdown.Trigger>
    );
};

export default BaseSelectDisplay;
