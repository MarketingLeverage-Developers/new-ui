import React from 'react';
import PlainButton from '../Button/PlainButton';
import styles from './InlineTextButton.module.scss';

export type InlineTextButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
};

const InlineTextButton = ({ children, onClick }: InlineTextButtonProps) => (
    <PlainButton className={styles.Inline} onClick={onClick}>
        {children}
    </PlainButton>
);

export default InlineTextButton;
