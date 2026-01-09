import StrictOverlay from '@/features/overlay/components/StrictOverlay';
import Modal from '@/shared/headless/Modal/Modal';
import BaseModalLayout from '@/shared/primitives/BaseModalLayout/BaseModalLayout';
import Form from '@/shared/primitives/Form/Form';
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
