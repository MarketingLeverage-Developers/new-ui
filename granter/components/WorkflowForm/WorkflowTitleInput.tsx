import React from 'react';
import SectionFieldInput, { type SectionFieldInputProps } from '../SectionFieldInput/SectionFieldInput';

export type WorkflowTitleInputProps = Omit<SectionFieldInputProps, 'size' | 'variant'>;

const WorkflowTitleInput = React.forwardRef<HTMLInputElement, WorkflowTitleInputProps>(
    (props, ref) => (
        <SectionFieldInput
            ref={ref}
            variant="workflow-title"
            {...props}
        />
    )
);

WorkflowTitleInput.displayName = 'WorkflowTitleInput';

export default WorkflowTitleInput;
