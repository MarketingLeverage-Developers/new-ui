import StrictOverlay from '../../../shared/composites/StrictOverlay/StrictOverlay';
import Modal from '../../../shared/headless/Modal/Modal';
import BaseModalLayout from '../../../BaseModalLayout/BaseModalLayout';
import Form from '../../../Form/Form';
import React from 'react';

type LayoutProps = {
    header?: React.ReactNode;
    width?: string | number;
    subTitle?: string;
    noBorder?: boolean;
    children: React.ReactNode;
};

export const Layout = ({ header, subTitle, width = 1100, noBorder, children }: LayoutProps) => (
    <>
        <Modal.Backdrop />
        <Modal.Content height={'80%'}>
            <StrictOverlay>
                <BaseModalLayout width={width}>
                    <Form>
                        <BaseModalLayout.Header title={header} subTitle={subTitle} noBorder={noBorder} />
                        <BaseModalLayout.ScrollerWrapper>{children}</BaseModalLayout.ScrollerWrapper>
                    </Form>
                </BaseModalLayout>
            </StrictOverlay>
        </Modal.Content>
    </>
);
