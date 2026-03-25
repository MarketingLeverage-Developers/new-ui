import React from 'react';
import SectionFieldSelect, { type SectionFieldSelectProps } from '../SectionFieldSelect/SectionFieldSelect';

export type SectionFieldRowSelectProps<T extends string = string> = SectionFieldSelectProps<T>;

const SectionFieldRowSelect = (<T extends string = string>(props: SectionFieldRowSelectProps<T>) => (
    <SectionFieldSelect {...props} />
)) as <T extends string = string>(props: SectionFieldRowSelectProps<T>) => React.ReactElement;

export default SectionFieldRowSelect;
