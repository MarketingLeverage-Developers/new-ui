import Modal from '@/shared/headless/Modal/Modal';
import Portal from '@/shared/headless/Portal/Portal';
import React from 'react';
import styles from './BaseModalContainer.module.scss';

export type BaseModalContainerProps = {
    open: boolean;
    onChange: () => void;
    content: React.ReactNode;
    width?: string | number;
    maxHeight?: string | number;
};

const BaseModalContainer = ({
    open,
    onChange,
    content,
    width = '100%',
    maxHeight = '100%',
}: BaseModalContainerProps) => (
    <Modal
        value={open}
        onChange={() => {
            onChange();
        }}
    >
        <Portal>
            <Modal.Backdrop />
            <Modal.Content width={width} height="100dvh" maxHeight={maxHeight} className={styles.BaseContent}>
                {content}
            </Modal.Content>
        </Portal>
    </Modal>
);

export default BaseModalContainer;
