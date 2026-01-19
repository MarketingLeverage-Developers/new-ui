import React, { createContext, useContext } from 'react';
import type ManySelect from '@/shared/headless/ManySelect/ManySelect';

import ChipMultiTab, { type ChipMultiTabExtraProps } from './components/ChipMultiTab/ChipMultiTab';
import ChipMultiTabItem, {
    type ChipMultiTabItemProps,
} from './components/ChipMultiTab/components/ChipMultiTabItem/ChipMultiTabItem';

export type MultiTabVariant = 'chip';

/** ✅ ManySelect 기반 공통 props */
export type MultiTabCommonProps = React.ComponentProps<typeof ManySelect>;

export type MultiTabProps = { variant: 'chip' } & MultiTabCommonProps & ChipMultiTabExtraProps;

/** variant 공유 */
type MultiTabVariantContextValue = {
    variant: MultiTabVariant;
};

const MultiTabVariantContext = createContext<MultiTabVariantContextValue | null>(null);

const useMultiTabVariant = () => {
    const ctx = useContext(MultiTabVariantContext);
    if (!ctx) {
        throw new Error("MultiTab.* must be used inside <MultiTab variant='chip' ...>");
    }
    return ctx;
};

/** ✅ Item 통합 (지금은 chip만 있지만, 나중에 variant 추가 시 확장) */
export type MultiTabItemProps = ChipMultiTabItemProps;

type MultiTabCompound = React.FC<MultiTabProps> & {
    Item: React.FC<MultiTabItemProps>;
};

const MultiTabRoot: React.FC<MultiTabProps> = (props) => {
    const { variant, ...rest } = props;

    return (
        <MultiTabVariantContext.Provider value={{ variant }}>
            {variant === 'chip' ? <ChipMultiTab {...(rest as MultiTabCommonProps & ChipMultiTabExtraProps)} /> : null}
        </MultiTabVariantContext.Provider>
    );
};

const MultiTabItem: React.FC<MultiTabItemProps> = (props) => {
    const { variant } = useMultiTabVariant();

    if (variant === 'chip') {
        return <ChipMultiTabItem {...props} />;
    }

    return null;
};

const MultiTab = Object.assign(MultiTabRoot, {
    Item: MultiTabItem,
}) as MultiTabCompound;

export default MultiTab;
