import React from 'react';
import { BiSolidTrashAlt } from 'react-icons/bi';
import styles from './TrashButton.module.scss';

export type TrashButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const TrashButton = React.forwardRef<HTMLButtonElement, TrashButtonProps>(({ onClick, className, ...props }, ref) => (
    <button ref={ref} {...props} className={`${styles.TrashButton} ${className ?? ''}`.trim()} onClick={onClick}>
        <BiSolidTrashAlt />
    </button>
));

TrashButton.displayName = 'TrashButton';

export default TrashButton;
