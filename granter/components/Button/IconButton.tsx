import React from 'react';
import Button, { type VariantButtonProps } from './Button';

export type IconButtonProps = VariantButtonProps;

const IconButton = (props: IconButtonProps) => <Button {...props} variant="icon" />;

export default IconButton;
