import React from 'react';
import Button, { type VariantButtonProps } from './Button';

export type GrayButtonProps = VariantButtonProps;

const GrayButton = (props: GrayButtonProps) => <Button {...props} variant="gray" />;

export default GrayButton;
