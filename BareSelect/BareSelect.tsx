import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import Select from '@/shared/headless/Select/Select';
import React from 'react';
import { Content, Display, Item } from './components';

type BareSelectProps = React.ComponentProps<typeof Select>;

const BareSelect = ({ ...props }: BareSelectProps) => (
    <Dropdown>
        <Select {...props} />
    </Dropdown>
);

export default BareSelect;

BareSelect.Item = Item;
BareSelect.Content = Content;
BareSelect.Display = Display;
