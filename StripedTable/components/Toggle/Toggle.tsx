import type Table from '@/shared/headless/Table/Table';
import { useRowDetails } from '@/shared/headless/Table/Table';
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';
import styles from './Toggle.module.scss';
import React from 'react';

// [ADD] 토글 클릭 콜백 타입 (any 대신 unknown 사용)
export type ToggleClickArgs = {
    item: unknown;
    rowKey: string;
    opened: boolean;
    ri: number;
};

type ToggleProps = React.ComponentProps<typeof Table.Toggle> & {
    // [ADD] 토글 클릭 콜백: toggle() 호출 직전에 실행
    onToggle?: (args: ToggleClickArgs) => void;
};

export const Toggle = ({ onToggle, ...props }: ToggleProps) => {
    const { row, ri, opened, toggle } = useRowDetails();

    const handleToggleClick = () => {
        // [ADD] 외부 콜백 먼저 실행
        onToggle?.({
            item: row.item as unknown,
            rowKey: row.key,
            opened,
            ri,
        });
        // [KEEP] 내부 열고/닫기 토글
        toggle();
    };

    return (
        <>
            {opened ? (
                <div className={styles.Toggle}>
                    <IoMdRemoveCircleOutline className={styles.Icon} onClick={handleToggleClick} />
                </div>
            ) : (
                <div className={styles.Toggle}>
                    <IoMdAddCircleOutline className={styles.Icon} onClick={handleToggleClick} />
                </div>
            )}
        </>
    );
};
