import Modal from '@/shared/headless/Modal/Modal';
import Portal from '@/shared/headless/Portal/Portal';
import React from 'react';

export type BaseModalContainerProps = {
    open: boolean;
    onChange: () => void;
    content: React.ReactNode;
    width?: string | number;
    maxHeight?: string | number;
};

const BaseModalContainer = ({ open, onChange, content, width = 400, maxHeight = '80%' }: BaseModalContainerProps) => (
    <Modal
        value={open}
        onChange={(nextOpen) => {
            if (!nextOpen) onChange();
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

export default BaseModalContainer;
