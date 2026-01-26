import React from 'react';

import BaseModalContainer, { type BaseModalContainerProps } from './components/BaseModalContainer/BaseModalContainer';
import RightDrawerModalContainer, {
    type RightDrawerModalContainerProps,
} from './components/RightDrawerModalContainer/RightDrawerModalContainer';

export type ModalContainerVariant = 'base' | 'right-drawer';

export type ModalContainerProps =
    | ({ variant?: 'base' } & BaseModalContainerProps)
    | ({ variant: 'right-drawer' } & RightDrawerModalContainerProps);

export const ModalContainer = (props: ModalContainerProps) => {
    const { variant = 'base', ...rest } = props as { variant?: ModalContainerVariant };

    if (variant === 'right-drawer') {
        return <RightDrawerModalContainer {...(rest as RightDrawerModalContainerProps)} />;
    }

    return <BaseModalContainer {...(rest as BaseModalContainerProps)} />;
};
