import React, { createContext, useContext } from 'react';

import type HeadlessSelect from '@/shared/headless/Select/Select';

import BaseSelect from './components/BaseSelect/BaseSelect';

import type { BaseSelectItemProps } from './components/BaseSelect/components/BaseSelectItem/BaseSelectItem';
import BaseSelectItem from './components/BaseSelect/components/BaseSelectItem/BaseSelectItem';

import type { BaseSelectDisplayProps } from './components/BaseSelect/components/BaseSelectDisplay/BaseSelectDisplay';
import BaseSelectDisplay from './components/BaseSelect/components/BaseSelectDisplay/BaseSelectDisplay';

import type { BaseSelectContentProps } from './components/BaseSelect/components/BaseSelectContent/BaseSelectContent';
import BaseSelectContent from './components/BaseSelect/components/BaseSelectContent/BaseSelectContent';

export type SelectVariant = 'base';

/** ✅ MultiSelect처럼 “공통 props” 명시 */
export type SelectCommonProps = React.ComponentProps<typeof HeadlessSelect>;

export type SelectProps = { variant: 'base' } & SelectCommonProps;

/** ✅ variant 공유 */
type SelectVariantContextValue = {
    variant: SelectVariant;
};

const SelectVariantContext = createContext<SelectVariantContextValue | null>(null);

const useSelectVariant = () => {
    const ctx = useContext(SelectVariantContext);
    if (!ctx) {
        throw new Error("Select.* must be used inside <Select variant='base' ...>");
    }
    return ctx;
};

/** ✅ 합성 컴포넌트 타입 */
export type SelectItemProps = BaseSelectItemProps;
export type SelectDisplayUnionProps = BaseSelectDisplayProps;
export type SelectContentUnionProps = BaseSelectContentProps;

type SelectCompound = React.FC<SelectProps> & {
    Item: React.FC<SelectItemProps>;
    Display: React.FC<SelectDisplayUnionProps>;
    Content: React.FC<SelectContentUnionProps>;
};

const SelectRoot: React.FC<SelectProps> = (props) => {
    const { variant, ...rest } = props;

    return (
        <SelectVariantContext.Provider value={{ variant }}>
            {variant === 'base' ? <BaseSelect {...(rest as SelectCommonProps)} /> : null}
        </SelectVariantContext.Provider>
    );
};

const SelectItem: React.FC<SelectItemProps> = (props) => {
    const { variant } = useSelectVariant();

    if (variant === 'base') {
        return <BaseSelectItem {...props} />;
    }

    return null;
};

const SelectDisplay: React.FC<SelectDisplayUnionProps> = (props) => {
    const { variant } = useSelectVariant();

    if (variant === 'base') {
        return <BaseSelectDisplay {...props} />;
    }

    return null;
};

const SelectContent: React.FC<SelectContentUnionProps> = (props) => {
    const { variant } = useSelectVariant();

    if (variant === 'base') {
        return <BaseSelectContent {...props} />;
    }

    return null;
};

const Select = Object.assign(SelectRoot, {
    Item: SelectItem,
    Display: SelectDisplay,
    Content: SelectContent,
}) as SelectCompound;

export default Select;
