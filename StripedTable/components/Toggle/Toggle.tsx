import type Table from '@/shared/headless/Table/Table';
import { useRowDetails } from '@/shared/headless/Table/Table';
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';
import styles from './Toggle.module.scss';

export const Toggle = (props: React.ComponentProps<typeof Table.Toggle>) => {
    const { opened, toggle, hasHidden } = useRowDetails();

    // [ADD] 안전 가드: 숨겨진 컬럼 없으면 아예 렌더하지 않음
    if (!hasHidden) return null;

    const handleToggleClick = () => {
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
