import StrictOverlay from '@/features/overlay/components/StrictOverlay';
import React from 'react';
import BaseModalLayout from '../../BaseModalLayout';
import Form from '@/shared/primitives/Form/Form';
import Modal from '@/shared/headless/Modal/Modal';
import Portal from '@/shared/headless/Portal/Portal';

type BaseModalFormTemplateProps = {
    content: React.ReactNode;
    footer: React.ReactNode;
    header: React.ReactNode;
    isScrollerContain?: boolean;
    modalValue: boolean;
    setModalValue: (open: boolean) => void;
    isBorder?: boolean;
};

const BaseModalFormTemplate = ({
    modalValue,
    setModalValue,
    header,
    content,
    footer,
    isScrollerContain = true,
    isBorder = true,
}: BaseModalFormTemplateProps) => (
    <Modal value={modalValue} onChange={setModalValue}>
        <Portal>
            <Modal.Backdrop />
            <Modal.Content maxHeight={'80%'}>
                <StrictOverlay>
                    <BaseModalLayout width={450}>
                        <Form>
                            <BaseModalLayout.Header title={header} noBorder={!isBorder} />
                            <BaseModalLayout.Content>
                                {isScrollerContain && (
                                    <BaseModalLayout.ScrollerWrapper>{content}</BaseModalLayout.ScrollerWrapper>
                                )}
                                {!isScrollerContain && <>{content}</>}
                            </BaseModalLayout.Content>
                            <BaseModalLayout.Footer noBorder={!isBorder}>{footer}</BaseModalLayout.Footer>
                        </Form>
                    </BaseModalLayout>
                </StrictOverlay>
            </Modal.Content>
        </Portal>
    </Modal>
);

export default BaseModalFormTemplate;
