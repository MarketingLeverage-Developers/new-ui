import React from 'react';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import HeadlessSelect from '@/shared/headless/Select/Select';
import BorderRoundedSelectDisplay, { type BorderRoundedSelectDisplayProps } from './components/Display/Display';
import BorderRoundedSelectContent, { type BorderRoundedSelectContentProps } from './components/Content/Content';
import BorderRoundedSelectItem, { type BorderRoundedSelectItemProps } from './components/Item/Item';

export type BorderRoundedSelectProps = React.ComponentProps<typeof HeadlessSelect>;

type BorderRoundedSelectCompound = React.FC<BorderRoundedSelectProps> & {
    Item: React.FC<BorderRoundedSelectItemProps>;
    Display: React.FC<BorderRoundedSelectDisplayProps>;
    Content: React.FC<BorderRoundedSelectContentProps>;
};

const BorderRoundedSelectRoot: React.FC<BorderRoundedSelectProps> = (props) => (
    <Dropdown>
        <HeadlessSelect {...props} />
    </Dropdown>
);

const BorderRoundedSelect = Object.assign(BorderRoundedSelectRoot, {
    Item: BorderRoundedSelectItem,
    Display: BorderRoundedSelectDisplay,
    Content: BorderRoundedSelectContent,
}) as BorderRoundedSelectCompound;

export default BorderRoundedSelect;
export type { BorderRoundedSelectItemProps, BorderRoundedSelectDisplayProps, BorderRoundedSelectContentProps };
