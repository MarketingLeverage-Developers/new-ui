import React from 'react';
import { BiSolidTrashAlt } from 'react-icons/bi';
import styles from './TrashButton.module.scss';

type TrashButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const TrashButton = ({ onClick, ...props }: TrashButtonProps) => (
    <button {...props} className={styles.TrashButton} onClick={onClick}>
        <BiSolidTrashAlt />
    </button>
);

export default TrashButton;
