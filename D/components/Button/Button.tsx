import React, { forwardRef } from 'react';
import BaseButton from './components/BaseButton/BaseButton';
import type { BaseButtonProps } from './components/BaseButton/BaseButton';

import TextButton, { type TextButtonProps } from './components/TextButton/TextButton';

import BoxButton, { type BoxButtonProps } from './components/BoxButton/BoxButton';
import HoverButton, { type HoverButtonProps } from './components/HoverButton/HoverButton';

import ApproveButton, { type ApproveButtonProps } from './components/ApproveButton/ApproveButton';
import RejectButton, { type RejectButtonProps } from './components/RejectButton/RejectButton';
import CancelButton, { type CancelButtonProps } from './components/CancelButton/CancelButton';
import PillButton, { type PillButtonProps } from './components/PillButton/PillButton';
import RoundedHoverButton, { type RoundedHoverButtonProps } from './components/RoundedHoverButton/RoundedHoverButton';
import TrashButton, { type TrashButtonProps } from './components/TrashButton/TrashButton';
import FileDownloadButton, { type FileDownloadButtonProps } from './components/FileDownloadButton/FileDownloadButton';

export type ButtonVariant =
    | 'base'
    | 'text'
    | 'box'
    | 'hover'
    | 'approve'
    | 'reject'
    | 'cancel'
    | 'pill'
    | 'rounded-hover'
    | 'trash'
    | 'file-download';

export type ButtonProps =
    | ({ variant: 'base' } & BaseButtonProps)
    | ({ variant: 'text' } & TextButtonProps)
    | ({ variant: 'box' } & BoxButtonProps)
    | ({ variant: 'hover' } & HoverButtonProps)
    | ({ variant: 'approve' } & ApproveButtonProps)
    | ({ variant: 'reject' } & RejectButtonProps)
    | ({ variant: 'cancel' } & CancelButtonProps)
    | ({ variant: 'pill' } & PillButtonProps)
    | ({ variant: 'rounded-hover' } & RoundedHoverButtonProps)
    | ({ variant: 'trash' } & TrashButtonProps)
    | ({ variant: 'file-download' } & FileDownloadButtonProps);

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { variant, ...rest } = props;

    if (variant === 'text') return <TextButton ref={ref} {...(rest as TextButtonProps)} />;
    if (variant === 'box') return <BoxButton ref={ref} {...(rest as BoxButtonProps)} />;
    if (variant === 'hover') return <HoverButton ref={ref} {...(rest as HoverButtonProps)} />;
    if (variant === 'approve') return <ApproveButton ref={ref} {...(rest as ApproveButtonProps)} />;
    if (variant === 'reject') return <RejectButton ref={ref} {...(rest as RejectButtonProps)} />;
    if (variant === 'cancel') return <CancelButton ref={ref} {...(rest as CancelButtonProps)} />;
    if (variant === 'pill') return <PillButton ref={ref} {...(rest as PillButtonProps)} />;
    if (variant === 'rounded-hover') return <RoundedHoverButton ref={ref} {...(rest as RoundedHoverButtonProps)} />;
    if (variant === 'trash') return <TrashButton ref={ref} {...(rest as TrashButtonProps)} />;
    if (variant === 'file-download') return <FileDownloadButton ref={ref} {...(rest as FileDownloadButtonProps)} />;

    return <BaseButton ref={ref} {...(rest as BaseButtonProps)} />;
});

Button.displayName = 'Button';

export default Button;
