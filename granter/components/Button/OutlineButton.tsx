import React from 'react';
import Button, { type VariantButtonProps } from './Button';

export type OutlineButtonProps = VariantButtonProps;

const OutlineButton = (props: OutlineButtonProps) => <Button {...props} variant="outline" />;

export default OutlineButton;
