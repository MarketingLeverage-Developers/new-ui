import BottomSheet from '../../../../../shared/headless/BottomSheet/BottomSheet';
import React from 'react';

export type BottomSheetModalContainerProps = {
    open: boolean;
    onChange: () => void;
    content: React.ReactNode;
    title?: string;
    height?: number | string;
    footer?: React.ReactNode;
    closeOnBackdrop?: boolean;
    tab?: React.ReactNode;
};

const BottomSheetModalContainer = ({
    open,
    onChange,
    content,
    title = '',
    height,
    footer,
    closeOnBackdrop,
    tab,
}: BottomSheetModalContainerProps) => (
    <BottomSheet
        open={open}
        onOpenChange={(nextOpen) => {
            if (!nextOpen) onChange();
        }}
    >
        <BottomSheet.Content title={title} height={height} closeOnBackdrop={closeOnBackdrop} tab={tab}>
            {content}
            {footer ? <BottomSheet.Footer>{footer}</BottomSheet.Footer> : null}
        </BottomSheet.Content>
    </BottomSheet>
);

export default BottomSheetModalContainer;
