import classNames from 'classnames';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { FiCalendar } from 'react-icons/fi';
import styles from './HeaderDateTrigger.module.scss';

export type HeaderDateTriggerProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> & {
    label: ReactNode;
};

const HeaderDateTrigger = ({
    className,
    label,
    ...props
}: HeaderDateTriggerProps) => (
    <button type="button" className={classNames(styles.Root, className)} {...props}>
        <span className={styles.Icon}>
            <FiCalendar size={16} />
        </span>
        <span className={styles.Label}>{label}</span>
    </button>
);

export default HeaderDateTrigger;
