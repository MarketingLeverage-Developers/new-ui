import React from 'react';
import Select from '@/shared/headless/Select/Select';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import { Content, Display, Item } from './components';

type RoundedSelectProps = React.ComponentProps<typeof Select>;

const RoundedSelect = ({ ...props }: RoundedSelectProps) => (
    <Dropdown>
        <Select {...props} />
    </Dropdown>
);

export default RoundedSelect;

RoundedSelect.Item = Item;
RoundedSelect.Content = Content;
RoundedSelect.Display = Display;
