import React from 'react';
import SectionFieldInput, { type SectionFieldInputProps } from '../SectionFieldInput/SectionFieldInput';

export type SectionFieldRowInputProps = SectionFieldInputProps;

const SectionFieldRowInput = React.forwardRef<HTMLInputElement, SectionFieldRowInputProps>((props, ref) => (
    <SectionFieldInput ref={ref} {...props} />
));

SectionFieldRowInput.displayName = 'SectionFieldRowInput';

export default SectionFieldRowInput;
