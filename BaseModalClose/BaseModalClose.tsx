import { useModal } from '@/shared/headless/Modal/Modal';
import styles from './BaseModalClose.module.scss';
import React from 'react';
import { IoCloseSharp } from 'react-icons/io5';

const BaseModalClose = () => {
    const { closeModal } = useModal();

    return (
        <button className={styles.BaseModalClose} onClick={closeModal}>
            <IoCloseSharp />
        </button>
    );
};

export default BaseModalClose;
