import React from 'react';

import BaseModalContainer, { type BaseModalContainerProps } from './components/BaseModalContainer/BaseModalContainer';
import BottomSheetModalContainer, {
    type BottomSheetModalContainerProps,
} from './components/BottomSheetModalContainer/BottomSheetModalContainer';
import RightDrawerModalContainer, {
    type RightDrawerModalContainerProps,
} from './components/RightDrawerModalContainer/RightDrawerModalContainer';

export type ModalContainerVariant = 'base' | 'right-drawer' | 'bottom-sheet';

export type ModalContainerProps =
    | ({ variant?: 'base' } & BaseModalContainerProps)
    | ({ variant: 'right-drawer' } & RightDrawerModalContainerProps)
    | ({ variant: 'bottom-sheet' } & BottomSheetModalContainerProps);

export const ModalContainer = (props: ModalContainerProps) => {
    const { variant = 'base', ...rest } = props as { variant?: ModalContainerVariant };

    if (variant === 'right-drawer') {
        return <RightDrawerModalContainer {...(rest as RightDrawerModalContainerProps)} />;
    }

    if (variant === 'bottom-sheet') {
        return <BottomSheetModalContainer {...(rest as BottomSheetModalContainerProps)} />;
    }

    return <BaseModalContainer {...(rest as BaseModalContainerProps)} />;
};
