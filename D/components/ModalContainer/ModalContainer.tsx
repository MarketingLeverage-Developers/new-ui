import Modal from '@/shared/headless/Modal/Modal';
import Portal from '@/shared/headless/Portal/Portal';
import React from 'react';

export const ModalContainer = ({
    open,
    onChange,
    content,
    width = 400,
    maxHeight = '80%',
}: {
    open: boolean;
    onChange: () => void;
    content: React.ReactNode;
    width?: string | number;
    maxHeight?: string | number;
}) => (
    <Modal
        value={open}
        onChange={() => {
            onChange();
        }}
        // enterAction={enterAction}
    >
        <Portal>
            <Modal.Backdrop />
            <Modal.Content width={width} maxHeight={maxHeight}>
                {content}
            </Modal.Content>
        </Portal>
    </Modal>
);
