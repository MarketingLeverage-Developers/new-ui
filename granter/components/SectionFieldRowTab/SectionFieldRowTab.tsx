import React from 'react';
import SectionFieldTab, {
    type SectionFieldTabDropdownItemProps,
    type SectionFieldTabItemProps,
    type SectionFieldTabProps,
} from '../SectionFieldTab/SectionFieldTab';

export type SectionFieldRowTabProps<T extends string = string> = SectionFieldTabProps<T>;
export type SectionFieldRowTabItemProps<T extends string = string> = SectionFieldTabItemProps<T>;
export type SectionFieldRowTabDropdownItemProps<T extends string = string> = SectionFieldTabDropdownItemProps<T>;

type SectionFieldRowTabComponent = (<T extends string = string>(props: SectionFieldRowTabProps<T>) => React.ReactElement) & {
    Item: typeof SectionFieldTab.Item;
    DropdownItem: typeof SectionFieldTab.DropdownItem;
};

const SectionFieldRowTab = ((props) => <SectionFieldTab {...props} />) as SectionFieldRowTabComponent;

SectionFieldRowTab.Item = SectionFieldTab.Item;
SectionFieldRowTab.DropdownItem = SectionFieldTab.DropdownItem;

export default SectionFieldRowTab;
