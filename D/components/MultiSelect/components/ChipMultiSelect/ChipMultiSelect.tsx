import React from 'react';
import ManySelect from '@/shared/headless/ManySelect/ManySelect';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';

import ChipMultiSelectItem from './components/ChipMultiSelectItem/ChipMultiSelectItem';
import ChipMultiSelectContent from './components/ChipMultiSelectContent/ChipMultiSelectContent';
import ChipMultiSelectDisplay from './components/ChipMultiSelectDisplay/ChipMultiSelectDisplay';

type ChipMultiSelectProps = React.ComponentProps<typeof ManySelect>;

type ChipMultiSelectCompound = React.FC<ChipMultiSelectProps> & {
    Item: typeof ChipMultiSelectItem;
    Content: typeof ChipMultiSelectContent;
    Display: typeof ChipMultiSelectDisplay;
};

const ChipMultiSelect = (({ children, ...props }: ChipMultiSelectProps) => (
    <Dropdown>
        <ManySelect {...props}>{children}</ManySelect>
    </Dropdown>
)) as ChipMultiSelectCompound;

ChipMultiSelect.Item = ChipMultiSelectItem;
ChipMultiSelect.Content = ChipMultiSelectContent;
ChipMultiSelect.Display = ChipMultiSelectDisplay;

export default ChipMultiSelect;
