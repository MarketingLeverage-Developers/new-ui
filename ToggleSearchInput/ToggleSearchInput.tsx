import React, { useState } from 'react';
import styles from './ToggleSearchInput.scss';
import { CiSearch } from 'react-icons/ci';
import Flex from '../Flex/Flex';
import classNames from 'classnames';
import { IoIosArrowBack } from 'react-icons/io';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import RoundedSearch from '../RoundedSearch/RoundedSearch';

type ToggleSearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    children: React.ReactNode;
};

const ToggleSearchInput = ({ children, value, onChange, ...props }: ToggleSearchInputProps) => {
    const [open, setOpen] = useState(false);

    const searchClassName = classNames(styles.SearchInput, {
        [styles.Open]: open,
        [styles.Off]: !open,
    });

    return (
        <div className={styles.ToggleSearchInput}>
            <Flex justify="space-between">
                {children}
                <Flex padding={5} onClick={() => setOpen(true)} className={styles.Cursor}>
                    <CiSearch strokeWidth={1.5} size={20} color={getThemeColor('Gray1')} />
                </Flex>
            </Flex>
            <div className={searchClassName}>
                <Flex padding={5} onClick={() => setOpen(false)} className={styles.Cursor}>
                    <IoIosArrowBack size={20} color={getThemeColor('Gray1')} />
                </Flex>
                <RoundedSearch placeholder="검색" value={value} onChange={onChange} width={'100%'} {...props} />
            </div>
        </div>
    );
};

export default ToggleSearchInput;
