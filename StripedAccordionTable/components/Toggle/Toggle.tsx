import type AccordionTable from '@/shared/headless/AccordionTable/AccordionTable';
import { useRowDetails } from '@/shared/headless/AccordionTable/AccordionTable';
import { IoMdAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';
import styles from './Toggle.module.scss';

export const Toggle = (props: React.ComponentProps<typeof AccordionTable.Toggle>) => {
    const { opened, toggle } = useRowDetails();

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
