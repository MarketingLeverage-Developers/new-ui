// 각 행의 디테일 open/close 토글 버튼
import type Table from '@/shared/headless/TableX/Table';
import { useRowDetails } from '@/shared/headless/TableX/Table';
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';
import styles from './Toggle.module.scss';
import React from 'react';

// 토글 클릭 콜백에 넘겨줄 인자 타입
export type ToggleClickArgs = {
    item: unknown;
    rowKey: string;
    opened: boolean;
    ri: number;
};

type ToggleProps = React.ComponentProps<typeof Table.Toggle> & {
    // 토글 클릭 콜백: 내부 toggle() 직전에 호출
    onToggle?: (args: ToggleClickArgs) => void;
};

export const Toggle = ({ onToggle, ...props }: ToggleProps) => {
    const { row, ri, opened, toggle } = useRowDetails();

    const handleToggleClick = () => {
        onToggle?.({
            item: row.item as unknown,
            rowKey: row.key,
            opened,
            ri,
        });
        toggle();
    };

    return (
        <>
            {opened ? (
                <div className={styles.Toggle}>
                    <IoMdRemoveCircleOutline className={styles.Icon} onClick={handleToggleClick} {...props} />
                </div>
            ) : (
                <div className={styles.Toggle}>
                    <IoMdAddCircleOutline className={styles.Icon} onClick={handleToggleClick} {...props} />
                </div>
            )}
        </>
    );
};
