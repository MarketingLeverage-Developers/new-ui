import React from 'react';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import HeadlessSelect from '@/shared/headless/Select/Select';

import BareSelectDisplay, { type BareSelectDisplayProps } from './components/Display/Display';
import BareSelectContent, { type BareSelectContentProps } from './components/Content/Content';
import BareSelectItem, { type BareSelectItemProps } from './components/Item/Item';

export type BareSelectProps = React.ComponentProps<typeof HeadlessSelect>;

type BareSelectCompound = React.FC<BareSelectProps> & {
    Item: React.FC<BareSelectItemProps>;
    Display: React.FC<BareSelectDisplayProps>;
    Content: React.FC<BareSelectContentProps>;
};

const BareSelectRoot: React.FC<BareSelectProps> = (props) => (
    <Dropdown>
        <HeadlessSelect {...props} />
    </Dropdown>
);

const BareSelect = Object.assign(BareSelectRoot, {
    Item: BareSelectItem,
    Display: BareSelectDisplay,
    Content: BareSelectContent,
}) as BareSelectCompound;

export default BareSelect;
export type { BareSelectItemProps, BareSelectDisplayProps, BareSelectContentProps };
