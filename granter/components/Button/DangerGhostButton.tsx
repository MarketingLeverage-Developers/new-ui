import React from 'react';
import Button, { type VariantButtonProps } from './Button';

export type DangerGhostButtonProps = VariantButtonProps;

const DangerGhostButton = (props: DangerGhostButtonProps) => <Button {...props} variant="danger-ghost" />;

export default DangerGhostButton;
