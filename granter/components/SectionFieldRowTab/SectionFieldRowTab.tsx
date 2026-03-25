import React from 'react';
import SectionFieldTab, {
    type SectionFieldTabItemProps,
    type SectionFieldTabProps,
} from '../SectionFieldTab/SectionFieldTab';

export type SectionFieldRowTabProps<T extends string = string> = SectionFieldTabProps<T>;
export type SectionFieldRowTabItemProps<T extends string = string> = SectionFieldTabItemProps<T>;

type SectionFieldRowTabComponent = (<T extends string = string>(props: SectionFieldRowTabProps<T>) => React.ReactElement) & {
    Item: typeof SectionFieldTab.Item;
};

const SectionFieldRowTab = ((props) => <SectionFieldTab {...props} />) as SectionFieldRowTabComponent;

SectionFieldRowTab.Item = SectionFieldTab.Item;

export default SectionFieldRowTab;
