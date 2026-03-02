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
import GranterActionButton, { type GranterActionButtonProps } from './components/GranterActionButton/GranterActionButton';
import GranterNavButton, { type GranterNavButtonProps } from './components/GranterNavButton/GranterNavButton';
import GranterBackButton, { type GranterBackButtonProps } from './components/GranterBackButton/GranterBackButton';

export type ButtonVariant =
    | 'base'
    | 'granter-primary'
    | 'granter-action'
    | 'granter-nav'
    | 'granter-back'
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
    | ({ variant: 'granter-primary' } & BaseButtonProps)
    | ({ variant: 'granter-action' } & GranterActionButtonProps)
    | ({ variant: 'granter-nav' } & GranterNavButtonProps)
    | ({ variant: 'granter-back' } & GranterBackButtonProps)
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

    if (variant === 'granter-primary')
        return <BaseButton ref={ref} {...(rest as BaseButtonProps)} styleVariant="granter" />;
    if (variant === 'granter-action') return <GranterActionButton {...(rest as GranterActionButtonProps)} />;
    if (variant === 'granter-nav') return <GranterNavButton {...(rest as GranterNavButtonProps)} />;
    if (variant === 'granter-back') return <GranterBackButton {...(rest as GranterBackButtonProps)} />;
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
