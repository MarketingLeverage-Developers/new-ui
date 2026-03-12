import React from 'react';
import Button, { type VariantButtonProps } from './Button';

export type LightButtonProps = VariantButtonProps;

const LightButton = (props: LightButtonProps) => <Button {...props} variant="light" />;

export default LightButton;
