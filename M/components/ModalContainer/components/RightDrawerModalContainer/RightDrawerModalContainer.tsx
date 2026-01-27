import Modal from '@/shared/headless/Modal/Modal';
import Portal from '@/shared/headless/Portal/Portal';
import React from 'react';
import styles from './RightDrawerModalContainer.module.scss';

export type RightDrawerModalContainerProps = {
    open: boolean;
    onChange: () => void;
    content: React.ReactNode;
    width?: string | number;
    maxHeight?: string | number;
};

const RightDrawerModalContainer = ({
    open,
    onChange,
    content,
    width = '100%',
    maxHeight = '100%',
}: RightDrawerModalContainerProps) => (
    <Modal
        value={open}
        onChange={() => {
            onChange();
        }}
    >
        <Portal>
            <Modal.Backdrop />
            <Modal.Content
                width={width}
                height="100dvh"
                maxHeight={maxHeight}
                className={styles.RightDrawerContent}
                data-open={open ? 'true' : 'false'}
            >
                {content}
            </Modal.Content>
        </Portal>
    </Modal>
);

export default RightDrawerModalContainer;
