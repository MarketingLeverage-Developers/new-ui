import React from 'react';
import { BiSolidTrashAlt } from 'react-icons/bi';
import styles from './TrashButton.module.scss';

type TrashButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onClick?: () => void;
};

const TrashButton = ({ onClick, ...props }: TrashButtonProps) => (
    <button {...props} className={styles.TrashButton}>
        <BiSolidTrashAlt onClick={onClick} />
    </button>
);

export default TrashButton;
