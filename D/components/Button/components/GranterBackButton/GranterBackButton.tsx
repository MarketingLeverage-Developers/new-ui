import React from 'react';
import { FiChevronLeft } from 'react-icons/fi';
import styles from './GranterBackButton.module.scss';

export type GranterBackButtonProps = {
    ariaLabel?: string;
    onClick?: () => void;
};

const GranterBackButton = ({ ariaLabel = 'go back', onClick }: GranterBackButtonProps) => (
    <button type="button" aria-label={ariaLabel} className={styles.BackButton} onClick={onClick}>
        <FiChevronLeft size={16} />
    </button>
);

export default GranterBackButton;
