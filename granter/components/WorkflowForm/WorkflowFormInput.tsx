import React from 'react';
import SectionFieldInput, { type SectionFieldInputProps } from '../SectionFieldInput/SectionFieldInput';

export type WorkflowFormInputProps = Omit<SectionFieldInputProps, 'size' | 'variant'>;

const WorkflowFormInput = React.forwardRef<HTMLInputElement, WorkflowFormInputProps>((props, ref) => (
    <SectionFieldInput ref={ref} variant="workflow" {...props} />
));

WorkflowFormInput.displayName = 'WorkflowFormInput';

export default WorkflowFormInput;
