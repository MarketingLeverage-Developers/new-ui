import Modal from '../../../../headless/Modal/Modal';
import Portal from '../../../../headless/Portal/Portal';
import Template from '@/components/Desktop/Template/Template';
import React from 'react';

export const ModalContainer = ({
    title,
    open,
    onChange,
    // enterAction,
    content,
}: {
    title: string;
    open: boolean;
    onChange: () => void;
    // enterAction: () => void;
    content: React.ReactNode;
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
            <Modal.Content maxHeight={'80%'}>
                <Template variant="modal" width={450}>
                    <Template.Header title={title} />
                    <Template.Content>
                        <Template.ScrollerWrapper>{content}</Template.ScrollerWrapper>
                    </Template.Content>
                </Template>
            </Modal.Content>
        </Portal>
    </Modal>
);
