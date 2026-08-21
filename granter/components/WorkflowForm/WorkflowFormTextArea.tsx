import React from 'react';
import SectionFieldTextArea, {
    type SectionFieldTextAreaProps,
} from '../SectionFieldTextArea/SectionFieldTextArea';

export type WorkflowFormTextAreaProps = Omit<SectionFieldTextAreaProps, 'variant'>;

const WorkflowFormTextArea = React.forwardRef<HTMLTextAreaElement, WorkflowFormTextAreaProps>((props, ref) => (
    <SectionFieldTextArea ref={ref} variant="workflow" {...props} />
));

WorkflowFormTextArea.displayName = 'WorkflowFormTextArea';

export default WorkflowFormTextArea;
