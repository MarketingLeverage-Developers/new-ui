import React from 'react';
import Button, { type VariantButtonProps } from './Button';

export type WhiteButtonProps = VariantButtonProps;

const WhiteButton = (props: WhiteButtonProps) => <Button {...props} variant="white" />;

export default WhiteButton;
