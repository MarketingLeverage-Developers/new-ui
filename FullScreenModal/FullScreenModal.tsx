import React from 'react';
import styles from './FullScreenModal.module.scss';
import Modal from '@/shared/headless/Modal/Modal';
import Trigger from './components/Trigger';
import Content from './components/Content';
import Close from './components/Close';

type FullScreenModalProps = {
    children: React.ReactNode;
};

export const FullScreenModal = ({ children }: FullScreenModalProps) => (
    <nav className={styles.FullScreenModal}>
        <Modal>{children}</Modal>
    </nav>
);

FullScreenModal.Trigger = Trigger;
FullScreenModal.Content = Content;
FullScreenModal.Close = Close;
