import React from 'react';
import styles from './CompanySelectFullScreenTrigger.module.scss';
import Modal from '@/shared/headless/Modal/Modal';

type DrawerProps = {
    Trigger?: React.ReactNode;
    children?: React.ReactNode;
};

export const CompanySelectFullScreenTrigger = ({ Trigger, children }: DrawerProps) => (
    <nav className={styles.CompanySelectFullScreenTrigger}>
        <Modal>
            <Modal.Trigger>{Trigger}</Modal.Trigger>
            <Modal.Content className={styles.Content}>{children}</Modal.Content>
        </Modal>
    </nav>
);
