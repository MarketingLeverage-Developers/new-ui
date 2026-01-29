import React, { useMemo, createContext, useContext } from 'react';
import ManySelect from '@/shared/headless/ManySelect/ManySelect';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import { QuerySearch } from '@/shared/headless/QuerySearch/QuerySearch';

import ChipMultiSelectItem from './components/ChipMultiSelectItem/ChipMultiSelectItem';
import ChipMultiSelectContent from './components/ChipMultiSelectContent/ChipMultiSelectContent';
import ChipMultiSelectDisplay from './components/ChipMultiSelectDisplay/ChipMultiSelectDisplay';

type ChipOption = { uuid: string; label: string };

type ChipMultiSelectConfig = {
    createOption?: React.ReactNode;
};

const ChipMultiSelectConfigContext = createContext<ChipMultiSelectConfig>({ createOption: undefined });
export const useChipMultiSelectConfig = () => useContext(ChipMultiSelectConfigContext);

const toText = (node: React.ReactNode): string => {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(toText).join(' ');
    if (React.isValidElement(node)) {
        const props = node.props as { children?: React.ReactNode };
        return toText(props.children);
    }
    return '';
};

const collectOptions = (children: React.ReactNode): ChipOption[] => {
    const result: ChipOption[] = [];

    const walk = (nodes: React.ReactNode) => {
        React.Children.forEach(nodes, (child) => {
            if (!React.isValidElement(child)) return;

            const element = child as React.ReactElement<{ value?: string; children?: React.ReactNode }>;
            const value = element.props?.value;
            if (typeof value === 'string') {
                const label = toText(element.props?.children).trim() || value;
                result.push({ uuid: value, label });
            }

            if (element.props?.children) walk(element.props.children);
        });
    };

    walk(children);

    const uniqMap = new Map<string, ChipOption>();
    result.forEach((opt) => {
        if (!uniqMap.has(opt.uuid)) uniqMap.set(opt.uuid, opt);
    });
    return Array.from(uniqMap.values());
};

export type ChipMultiSelectProps = React.ComponentProps<typeof ManySelect> & {
    searchLabel?: string;
    createOption?: React.ReactNode;
};

type ChipMultiSelectCompound = React.FC<ChipMultiSelectProps> & {
    Item: typeof ChipMultiSelectItem;
    Content: typeof ChipMultiSelectContent;
    Display: typeof ChipMultiSelectDisplay;
};

const ChipMultiSelect = (({ children, searchLabel = '옵션', ...props }: ChipMultiSelectProps) => {
    const searchData = useMemo(() => collectOptions(children), [children]);

    return (
        <ChipMultiSelectConfigContext.Provider value={{ createOption: props.createOption }}>
            <QuerySearch label={searchLabel} data={searchData}>
                <Dropdown>
                    <ManySelect {...props}>{children}</ManySelect>
                </Dropdown>
            </QuerySearch>
        </ChipMultiSelectConfigContext.Provider>
    );
}) as ChipMultiSelectCompound;

ChipMultiSelect.Item = ChipMultiSelectItem;
ChipMultiSelect.Content = ChipMultiSelectContent;
ChipMultiSelect.Display = ChipMultiSelectDisplay;

export default ChipMultiSelect;
