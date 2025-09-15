import React from 'react';
import styles from '../FullScreenModal.module.scss';
import Modal from '@/shared/headless/Modal/Modal';

type ContentProps = {
    content: React.ReactNode;
};

const Content = ({ content }: ContentProps) => <Modal.Content className={styles.Content}>{content}</Modal.Content>;

export default Content;
