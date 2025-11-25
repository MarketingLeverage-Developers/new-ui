import { useModal } from '@/shared/headless/Modal/Modal';
import styles from './BaseModalClose.module.scss';
import React from 'react';
import { IoCloseSharp } from 'react-icons/io5';

type BaseModalCloseProps = {
    onClick?: () => void;
};

const BaseModalClose = ({ onClick }: BaseModalCloseProps) => {
    const { closeModal } = useModal();

    const handleClick = () => {
        onClick?.();
        closeModal();
    };

    return (
        <button className={styles.BaseModalClose} onClick={handleClick}>
            <IoCloseSharp />
        </button>
    );
};

export default BaseModalClose;
