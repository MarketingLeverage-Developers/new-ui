import React, { createContext, useContext } from 'react';

import type ManySelect from '@/shared/headless/ManySelect/ManySelect';

import ChipMultiSelect, { type ChipMultiSelectProps } from './components/ChipMultiSelect/ChipMultiSelect';
import type { ChipMultiSelectItemProps } from './components/ChipMultiSelect/components/ChipMultiSelectItem/ChipMultiSelectItem';
import ChipMultiSelectItem from './components/ChipMultiSelect/components/ChipMultiSelectItem/ChipMultiSelectItem';
import ChipMultiSelectContent, {
    type ChipMultiSelectContentProps,
} from './components/ChipMultiSelect/components/ChipMultiSelectContent/ChipMultiSelectContent';
import ChipMultiSelectDisplay, {
    type ChipMultiSelectDisplayProps,
} from './components/ChipMultiSelect/components/ChipMultiSelectDisplay/ChipMultiSelectDisplay';

export type MultiSelectVariant = 'chip' | 'plain';

/** ✅ Input 패턴처럼 “공통 props”를 명시 */
export type MultiSelectCommonProps = React.ComponentProps<typeof ManySelect>;

export type MultiSelectProps =
    | ({ variant: 'chip' } & ChipMultiSelectProps)
    | ({ variant: Exclude<MultiSelectVariant, 'chip'> } & MultiSelectCommonProps);

/** variant 공유 (지금은 chip만 있지만, 나중에 variant 늘릴 때 그대로 확장) */
type MultiSelectVariantContextValue = {
    variant: MultiSelectVariant;
};

const MultiSelectVariantContext = createContext<MultiSelectVariantContextValue | null>(null);

const useMultiSelectVariant = () => {
    const ctx = useContext(MultiSelectVariantContext);
    if (!ctx) {
        throw new Error("MultiSelect.* must be used inside <MultiSelect variant='chip' ...>");
    }
    return ctx;
};

export type MultiSelectItemProps = ChipMultiSelectItemProps;
export type MultiSelectDisplayUnionProps = ChipMultiSelectDisplayProps;
export type MultiSelectContentUnionProps = ChipMultiSelectContentProps;

type MultiSelectCompound = React.FC<MultiSelectProps> & {
    Item: React.FC<MultiSelectItemProps>;
    Display: React.FC<MultiSelectDisplayUnionProps>;
    Content: React.FC<MultiSelectContentUnionProps>;
};

const MultiSelectRoot: React.FC<MultiSelectProps> = (props) => {
    const { variant, ...rest } = props;

    return (
        <MultiSelectVariantContext.Provider value={{ variant }}>
            {/* ✅ Dropdown + ManySelect 조합은 variant 컴포넌트 안에서 처리 */}
            {variant === 'chip' ? (
                <ChipMultiSelect {...(rest as ChipMultiSelectProps)} />
            ) : (
                null
            )}
        </MultiSelectVariantContext.Provider>
    );
};

const MultiSelectItem: React.FC<MultiSelectItemProps> = (props) => {
    const { variant } = useMultiSelectVariant();

    if (variant === 'chip') {
        return <ChipMultiSelectItem {...props} />;
    }

    return null;
};

const MultiSelectDisplay: React.FC<MultiSelectDisplayUnionProps> = (props) => {
    const { variant } = useMultiSelectVariant();

    if (variant === 'chip') {
        return <ChipMultiSelectDisplay {...props} />;
    }

    return null;
};

const MultiSelectContent: React.FC<MultiSelectContentUnionProps> = (props) => {
    const { variant } = useMultiSelectVariant();

    if (variant === 'chip') {
        return <ChipMultiSelectContent {...props} />;
    }

    return null;
};

const MultiSelect = Object.assign(MultiSelectRoot, {
    Item: MultiSelectItem,
    Display: MultiSelectDisplay,
    Content: MultiSelectContent,
}) as MultiSelectCompound;

export default MultiSelect;
