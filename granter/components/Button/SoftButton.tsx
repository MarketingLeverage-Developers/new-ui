import React from 'react';
import Button, { type VariantButtonProps } from './Button';

export type SoftButtonProps = VariantButtonProps;

const SoftButton = (props: SoftButtonProps) => <Button {...props} variant="soft" />;

export default SoftButton;
