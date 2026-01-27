import React, { createContext, useContext } from 'react';

import type HeadlessSelect from '@/shared/headless/Select/Select';

import BaseSelect from './components/BaseSelect/BaseSelect';
import type { BaseSelectItemProps } from './components/BaseSelect/components/BaseSelectItem/BaseSelectItem';
import BaseSelectItem from './components/BaseSelect/components/BaseSelectItem/BaseSelectItem';
import type { BaseSelectDisplayProps } from './components/BaseSelect/components/BaseSelectDisplay/BaseSelectDisplay';
import BaseSelectDisplay from './components/BaseSelect/components/BaseSelectDisplay/BaseSelectDisplay';
import type { BaseSelectContentProps } from './components/BaseSelect/components/BaseSelectContent/BaseSelectContent';
import BaseSelectContent from './components/BaseSelect/components/BaseSelectContent/BaseSelectContent';

import BareSelect from './components/BareSelect/BareSelect';
import type {
    BareSelectItemProps,
    BareSelectDisplayProps,
    BareSelectContentProps,
} from './components/BareSelect/BareSelect';
import BareSelectItem from './components/BareSelect/components/Item/Item';
import BareSelectDisplay from './components/BareSelect/components/Display/Display';
import BareSelectContent from './components/BareSelect/components/Content/Content';

import RoundedSelect from './components/RoundedSelect/RoundedSelect';
import type {
    RoundedSelectItemProps,
    RoundedSelectDisplayProps,
    RoundedSelectContentProps,
} from './components/RoundedSelect/RoundedSelect';
import RoundedSelectItem from './components/RoundedSelect/components/Item/Item';
import RoundedSelectDisplay from './components/RoundedSelect/components/Display/Display';
import RoundedSelectContent from './components/RoundedSelect/components/Content/Content';

import BorderRoundedSelect from './components/BorderRoundedSelect/BorderRoundedSelect';
import type {
    BorderRoundedSelectItemProps,
    BorderRoundedSelectDisplayProps,
    BorderRoundedSelectContentProps,
} from './components/BorderRoundedSelect/BorderRoundedSelect';
import BorderRoundedSelectItem from './components/BorderRoundedSelect/components/Item/Item';
import BorderRoundedSelectDisplay from './components/BorderRoundedSelect/components/Display/Display';
import BorderRoundedSelectContent from './components/BorderRoundedSelect/components/Content/Content';

import SearchSelectInput from './components/SearchSelect/components/Input/Input';
import type { SearchSelectInputProps } from './components/SearchSelect/components/Input/Input';
import SearchSelectContent from './components/SearchSelect/components/Content/Content';

import SearchManySelectInput from './components/SearchManySelect/components/Input/Input';
import type { SearchManySelectInputProps } from './components/SearchManySelect/components/Input/Input';
import SearchManySelectContent from './components/SearchManySelect/components/Content/Content';
import SearchManySelectSelected from './components/SearchManySelect/components/Selected/Selected';

export type SelectVariant = 'base' | 'bare' | 'rounded' | 'border-rounded' | 'search' | 'search-many';

export type SelectCommonProps = React.ComponentProps<typeof HeadlessSelect>;

export type SelectProps = { variant: SelectVariant } & SelectCommonProps;

/** ✅ variant 공유 */
type SelectVariantContextValue = {
    variant: SelectVariant;
};

const SelectVariantContext = createContext<SelectVariantContextValue | null>(null);

const useSelectVariant = () => {
    const ctx = useContext(SelectVariantContext);
    if (!ctx) {
        throw new Error(
            "Select.* must be used inside <Select variant='base' | 'bare' | 'rounded' | 'border-rounded' | 'search' | 'search-many' ...>"
        );
    }
    return ctx;
};

/** ✅ 합성 컴포넌트 타입 */
export type SelectItemProps =
    | BaseSelectItemProps
    | BareSelectItemProps
    | RoundedSelectItemProps
    | BorderRoundedSelectItemProps;
export type SelectDisplayUnionProps =
    | BaseSelectDisplayProps
    | BareSelectDisplayProps
    | RoundedSelectDisplayProps
    | BorderRoundedSelectDisplayProps
    | SearchSelectInputProps
    | SearchManySelectInputProps;
export type SelectContentUnionProps =
    | BaseSelectContentProps
    | BareSelectContentProps
    | RoundedSelectContentProps
    | BorderRoundedSelectContentProps
    | Record<string, never>;
export type SelectInputUnionProps = SearchSelectInputProps | SearchManySelectInputProps;
export type SelectSelectedUnionProps = Record<string, never>;

type SelectCompound = React.FC<SelectProps> & {
    Item: React.FC<SelectItemProps>;
    Display: React.FC<SelectDisplayUnionProps>;
    Content: React.FC<SelectContentUnionProps>;
    Input?: React.FC<SelectInputUnionProps>;
    Selected?: React.FC<SelectSelectedUnionProps>;
};

const SelectRoot: React.FC<SelectProps> = (props) => {
    const { variant, ...rest } = props;

    return (
        <SelectVariantContext.Provider value={{ variant }}>
            {variant === 'base' ? <BaseSelect {...(rest as SelectCommonProps)} /> : null}
            {variant === 'bare' ? <BareSelect {...(rest as SelectCommonProps)} /> : null}
            {variant === 'rounded' ? <RoundedSelect {...(rest as SelectCommonProps)} /> : null}
            {variant === 'border-rounded' ? <BorderRoundedSelect {...(rest as SelectCommonProps)} /> : null}
            {variant === 'search' ? <BaseSelect {...(rest as SelectCommonProps)} /> : null}
            {variant === 'search-many' ? <BaseSelect {...(rest as SelectCommonProps)} /> : null}
        </SelectVariantContext.Provider>
    );
};

const SelectItem: React.FC<SelectItemProps> = (props) => {
    const { variant } = useSelectVariant();

    if (variant === 'base') return <BaseSelectItem {...(props as BaseSelectItemProps)} />;
    if (variant === 'bare') return <BareSelectItem {...(props as BareSelectItemProps)} />;
    if (variant === 'rounded') return <RoundedSelectItem {...(props as RoundedSelectItemProps)} />;
    if (variant === 'border-rounded') return <BorderRoundedSelectItem {...(props as BorderRoundedSelectItemProps)} />;

    return null;
};

const SelectDisplay: React.FC<SelectDisplayUnionProps> = (props) => {
    const { variant } = useSelectVariant();

    if (variant === 'base') return <BaseSelectDisplay {...(props as BaseSelectDisplayProps)} />;
    if (variant === 'bare') return <BareSelectDisplay {...(props as BareSelectDisplayProps)} />;
    if (variant === 'rounded') return <RoundedSelectDisplay {...(props as RoundedSelectDisplayProps)} />;
    if (variant === 'border-rounded')
        return <BorderRoundedSelectDisplay {...(props as BorderRoundedSelectDisplayProps)} />;
    if (variant === 'search') return <SearchSelectInput {...(props as SearchSelectInputProps)} />;
    if (variant === 'search-many') return <SearchManySelectInput {...(props as SearchManySelectInputProps)} />;

    return null;
};

const SelectContent: React.FC<SelectContentUnionProps> = (props) => {
    const { variant } = useSelectVariant();

    if (variant === 'base') return <BaseSelectContent {...(props as BaseSelectContentProps)} />;
    if (variant === 'bare') return <BareSelectContent {...(props as BareSelectContentProps)} />;
    if (variant === 'rounded') return <RoundedSelectContent {...(props as RoundedSelectContentProps)} />;
    if (variant === 'border-rounded')
        return <BorderRoundedSelectContent {...(props as BorderRoundedSelectContentProps)} />;
    if (variant === 'search') return <SearchSelectContent />;
    if (variant === 'search-many') return <SearchManySelectContent />;

    return null;
};

const SelectInput: React.FC<SelectInputUnionProps> = (props) => {
    const { variant } = useSelectVariant();

    if (variant === 'search') return <SearchSelectInput {...(props as SearchSelectInputProps)} />;
    if (variant === 'search-many') return <SearchManySelectInput {...(props as SearchManySelectInputProps)} />;

    return null;
};

const SelectSelected: React.FC<SelectSelectedUnionProps> = () => {
    const { variant } = useSelectVariant();

    if (variant === 'search-many') return <SearchManySelectSelected />;

    return null;
};

const Select = Object.assign(SelectRoot, {
    Item: SelectItem,
    Display: SelectDisplay,
    Content: SelectContent,
    Input: SelectInput,
    Selected: SelectSelected,
}) as SelectCompound;

export default Select;
