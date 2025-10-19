import type Table from '@/shared/headless/Table/Table';
import { useRowDetails } from '@/shared/headless/Table/Table';
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';
import styles from './Toggle.module.scss';

export const Toggle = ({
    // [ADD]
    forceVisible = false,
    ...props
}: React.ComponentProps<typeof Table.Toggle> & { forceVisible?: boolean }) => {
    const { opened, toggle, hasHidden } = useRowDetails();

    // [CHANGE] 강제 표시가 아니고 숨김도 없으면 렌더하지 않음
    if (!forceVisible && !hasHidden) return null;

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
