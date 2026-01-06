import React from 'react';
import BaseModalClose from '../../BaseModalClose/BaseModalClose';
import styles from './Header.module.scss';

type HeaderProps = { title: string; rightNode?: React.ReactNode };

const Header = ({ title, rightNode }: HeaderProps) => (
    <div className={styles.SideModalHeader}>
        <span className={styles.SideModalTitle}>{title}</span>
        <div>
            {rightNode}
            <BaseModalClose />
        </div>
    </div>
);

export default Header;
