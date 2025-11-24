import React, { useState } from 'react';
import styles from './ToggleSearchInput.module.scss';
import { CiSearch } from 'react-icons/ci';
import Flex from '../Flex/Flex';
import classNames from 'classnames';
import { IoIosArrowForward } from 'react-icons/io';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import RoundedSearch from '../RoundedSearch/RoundedSearch';
import BaseButton from '../BaseButton/BaseButton';

type ToggleSearchInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    children: React.ReactNode;
    onSearchHandler?: () => void;
};

const ToggleSearchInput = ({ children, value, onChange, onSearchHandler, ...props }: ToggleSearchInputProps) => {
    const [open, setOpen] = useState(false);

    const searchClassName = classNames(styles.SearchInput, {
        [styles.Active]: open,
    });

    return (
        <div className={styles.ToggleSearchInput}>
            <Flex justify="space-between">
                {children}
                <Flex padding={5} onClick={() => setOpen(true)} className={styles.Cursor}>
                    {!open && <CiSearch strokeWidth={1.5} size={20} color={getThemeColor('Gray1')} />}
                </Flex>
            </Flex>
            <div className={searchClassName}>
                <Flex padding={5} onClick={() => setOpen(false)} className={styles.Cursor}>
                    <IoIosArrowForward size={20} color={getThemeColor('Gray1')} />
                </Flex>
                <RoundedSearch placeholder="검색" value={value} onChange={onChange} width={'100%'} {...props} />

                <BaseButton
                    height={34}
                    width={60}
                    padding={{ x: 12 }}
                    radius={6}
                    fontSize={13}
                    bgColor={getThemeColor('Primary1')}
                    textColor={getThemeColor('White1')}
                    onClick={onSearchHandler}
                >
                    검색
                </BaseButton>
            </div>
        </div>
    );
};

export default ToggleSearchInput;
