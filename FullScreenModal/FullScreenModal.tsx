import React from 'react';
import styles from './FullScreenTrigger.module.scss';
import Modal from '@/shared/headless/Modal/Modal';
import Trigger from './components/Trigger';
import Content from './components/Content';

type FullScreenModalProps = {
    children: React.ReactNode;
};

export const FullScreenModal = ({ children }: FullScreenModalProps) => (
    <nav className={styles.CompanySelectFullScreenTrigger}>
        <Modal>{children}</Modal>
    </nav>
);

FullScreenModal.Trigger = Trigger;
FullScreenModal.Content = Content;
