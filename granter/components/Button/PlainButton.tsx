import React from 'react';
import Button, { type VariantButtonProps } from './Button';

export type PlainButtonProps = VariantButtonProps;

const PlainButton = (props: PlainButtonProps) => <Button {...props} plain />;

export default PlainButton;
