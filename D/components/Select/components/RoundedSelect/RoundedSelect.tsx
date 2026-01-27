import React from 'react';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import HeadlessSelect from '@/shared/headless/Select/Select';
import RoundedSelectDisplay, { type RoundedSelectDisplayProps } from './components/Display/Display';
import RoundedSelectContent, { type RoundedSelectContentProps } from './components/Content/Content';
import RoundedSelectItem, { type RoundedSelectItemProps } from './components/Item/Item';

export type RoundedSelectProps = React.ComponentProps<typeof HeadlessSelect>;

type RoundedSelectCompound = React.FC<RoundedSelectProps> & {
    Item: React.FC<RoundedSelectItemProps>;
    Display: React.FC<RoundedSelectDisplayProps>;
    Content: React.FC<RoundedSelectContentProps>;
};

const RoundedSelectRoot: React.FC<RoundedSelectProps> = (props) => (
    <Dropdown>
        <HeadlessSelect {...props} />
    </Dropdown>
);

const RoundedSelect = Object.assign(RoundedSelectRoot, {
    Item: RoundedSelectItem,
    Display: RoundedSelectDisplay,
    Content: RoundedSelectContent,
}) as RoundedSelectCompound;

export default RoundedSelect;
export type { RoundedSelectItemProps, RoundedSelectDisplayProps, RoundedSelectContentProps };
