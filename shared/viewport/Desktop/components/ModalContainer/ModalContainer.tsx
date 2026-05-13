import Modal from '../../../../headless/Modal/Modal';
import Portal from '../../../../headless/Portal/Portal';
import ModalTemplate from '@/components/common/D/components/Template/components/ModalTemplate/ModalTemplate';
import type { ReactNode } from 'react';

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
    content: ReactNode;
}) => (
    <Modal
        value={open}
        onChange={(nextOpen) => {
            if (!nextOpen) {
                onChange();
            }
        }}
        // enterAction={enterAction}
    >
        <Portal>
            <Modal.Backdrop />
            <Modal.Content width={450} maxHeight="80%">
                <ModalTemplate width="100%" padding={0}>
                    <ModalTemplate.Header title={title} onClose={onChange} />
                    <ModalTemplate.Main>{content}</ModalTemplate.Main>
                </ModalTemplate>
            </Modal.Content>
        </Portal>
    </Modal>
);
