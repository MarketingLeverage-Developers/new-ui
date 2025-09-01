import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import Select from '@/shared/headless/Select/Select';
import React from 'react';
import { Content, Display, Item } from './components';

type BorderRoundedSelectProps = React.ComponentProps<typeof Select>;

const BorderRoundedSelect = ({ ...props }: BorderRoundedSelectProps) => (
    <Dropdown>
        <Select {...props} />
    </Dropdown>
);

export default BorderRoundedSelect;

BorderRoundedSelect.Item = Item;
BorderRoundedSelect.Content = Content;
BorderRoundedSelect.Display = Display;
