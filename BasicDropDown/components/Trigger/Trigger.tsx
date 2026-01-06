import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import React from 'react';
import styles from './Trigger.module.scss';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

type TriggerProps = {
    children: React.ReactNode;
    onPrev: () => void;
    onNext: () => void;
    disabledPrev?: boolean;
    disabledNext?: boolean;
} & React.ComponentProps<typeof Dropdown.Trigger>;

export const Trigger = ({ children, onPrev, onNext, disabledPrev, disabledNext, ...props }: TriggerProps) => (
    <div className={styles.Wrapper}>
        <button type="button" className={styles.NavPrev} onClick={onPrev} disabled={disabledPrev} aria-label="Previous">
            <MdChevronLeft />
        </button>

        <Dropdown.Trigger {...props}>
            <div className={styles.Trigger}>
                {children}
                {/* <MdOutlineKeyboardArrowDown className={styles.Arrow} /> */}
            </div>
        </Dropdown.Trigger>

        <button type="button" className={styles.NavNext} onClick={onNext} disabled={disabledNext} aria-label="Next">
            <MdChevronRight />
        </button>
    </div>
);
