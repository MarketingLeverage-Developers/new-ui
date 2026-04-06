import BottomSheet from '@/shared/headless/BottomSheet/BottomSheet';
import type { ReactNode } from 'react';

export type SheetModalProps = {
    open: boolean;
    onChange: () => void;
    title?: string;
    height?: string | number;
    footer?: ReactNode;
    tab?: ReactNode;
    hideHeader?: boolean;
    closeOnBackdrop?: boolean;
    children: ReactNode;
};

const SheetModal = ({
    open,
    onChange,
    title = '',
    height,
    footer,
    tab,
    hideHeader = false,
    closeOnBackdrop,
    children,
}: SheetModalProps) => (
    <BottomSheet
        open={open}
        onOpenChange={(nextOpen) => {
            if (!nextOpen) onChange();
        }}
    >
        <BottomSheet.Content
            title={title}
            height={height}
            closeOnBackdrop={closeOnBackdrop}
            tab={tab}
            hideHeader={hideHeader}
        >
            {children}
            {footer ? <BottomSheet.Footer>{footer}</BottomSheet.Footer> : null}
        </BottomSheet.Content>
    </BottomSheet>
);

export default SheetModal;
