import React from 'react';
import SectionFieldDateInput, {
    type SectionFieldDateInputProps,
} from '../SectionFieldDateInput/SectionFieldDateInput';

export type WorkflowFormDateInputProps = Omit<SectionFieldDateInputProps, 'variant'>;

const WorkflowFormDateInput = React.forwardRef<HTMLInputElement, WorkflowFormDateInputProps>((props, ref) => (
    <SectionFieldDateInput ref={ref} variant="workflow" {...props} />
));

WorkflowFormDateInput.displayName = 'WorkflowFormDateInput';

export default WorkflowFormDateInput;
