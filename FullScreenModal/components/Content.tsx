import React from 'react';
import styles from '../FullScreenModal.module.scss';
import Modal from '@/shared/headless/Modal/Modal';

type ContentProps = {
    children: React.ReactNode;
};

const Content = ({ children }: ContentProps) => <Modal.Content className={styles.Content}>{children}</Modal.Content>;

export default Content;
