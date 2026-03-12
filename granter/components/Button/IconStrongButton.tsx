import React from 'react';
import Button, { type VariantButtonProps } from './Button';

export type IconStrongButtonProps = VariantButtonProps;

const IconStrongButton = (props: IconStrongButtonProps) => <Button {...props} variant="icon-strong" />;

export default IconStrongButton;
