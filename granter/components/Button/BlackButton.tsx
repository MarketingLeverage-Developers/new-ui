import React from 'react';
import Button, { type VariantButtonProps } from './Button';

export type BlackButtonProps = VariantButtonProps;

const BlackButton = (props: BlackButtonProps) => <Button {...props} variant="black" />;

export default BlackButton;
