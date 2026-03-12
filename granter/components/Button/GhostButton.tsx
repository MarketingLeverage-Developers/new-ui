import React from 'react';
import Button, { type VariantButtonProps } from './Button';

export type GhostButtonProps = VariantButtonProps;

const GhostButton = (props: GhostButtonProps) => <Button {...props} variant="ghost" />;

export default GhostButton;
