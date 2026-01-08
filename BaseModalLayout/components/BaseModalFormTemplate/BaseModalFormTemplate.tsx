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
    subTitle?: string;
    width?: string | number;
};

const BaseModalFormTemplate = ({
    modalValue,
    setModalValue,
    header,
    subTitle,
    content,
    footer,
    isScrollerContain = true,
    isBorder = true,
    width = 450,
}: BaseModalFormTemplateProps) => (
    <Modal value={modalValue} onChange={setModalValue}>
        <Portal>
            <Modal.Backdrop />
            <Modal.Content maxHeight={'80%'}>
                <StrictOverlay>
                    <BaseModalLayout width={width}>
                        <Form>
                            <BaseModalLayout.Header title={header} subTitle={subTitle} noBorder={!isBorder} />
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
