import type { ReactElement } from 'react';
import SectionFieldSelect, { type SectionFieldSelectProps } from '../SectionFieldSelect/SectionFieldSelect';

export type WorkflowFormSelectProps<T extends string = string> = Omit<
    SectionFieldSelectProps<T>,
    'size' | 'variant'
>;

const WorkflowFormSelect = (<T extends string = string>(props: WorkflowFormSelectProps<T>) => (
    <SectionFieldSelect {...props} variant="workflow" />
)) as <T extends string = string>(props: WorkflowFormSelectProps<T>) => ReactElement;

export default WorkflowFormSelect;
