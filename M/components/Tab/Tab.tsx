import React, { createContext, useContext } from 'react';
import BaseTab, { type BaseTabExtraProps } from './components/BaseTab/components/BaseTab/BaseTab';
import BaseTabItem, { type BaseTabItemProps } from './components/BaseTab/components/BaseTab/components/BaseTabItem/BaseTabItem';
import ButtonTab, { type ButtonTabExtraProps } from './components/ButtonTab/components/ButtonTab/ButtonTab';
import ButtonTabItem, {
    type ButtonTabItemProps,
} from './components/ButtonTab/components/ButtonTab/components/ButtonTabItem/ButtonTabItem';
import type Select from '@/shared/headless/Select/Select';

export type TabVariant = 'base' | 'button';

export type TabCommonProps = React.ComponentProps<typeof Select>;

export type TabProps =
    | ({ variant: 'base' } & TabCommonProps & BaseTabExtraProps)
    | ({ variant: 'button' } & TabCommonProps & ButtonTabExtraProps);

type TabVariantContextValue = {
    variant: TabVariant;
};

const TabVariantContext = createContext<TabVariantContextValue | null>(null);

const useTabVariant = () => {
    const ctx = useContext(TabVariantContext);
    if (!ctx) {
        throw new Error("Tab.Item must be used inside <Tab variant='base' | 'button'>");
    }
    return ctx;
};

const TabRoot: React.FC<TabProps> = (props) => {
    const { variant, ...rest } = props;

    if (variant === 'button') {
        return (
            <TabVariantContext.Provider value={{ variant }}>
                <ButtonTab {...(rest as TabCommonProps & ButtonTabExtraProps)} />
            </TabVariantContext.Provider>
        );
    }

    return (
        <TabVariantContext.Provider value={{ variant: 'base' }}>
            <BaseTab {...(rest as TabCommonProps & BaseTabExtraProps)} />
        </TabVariantContext.Provider>
    );
};

export type TabItemProps = BaseTabItemProps | ButtonTabItemProps;

const TabItem: React.FC<TabItemProps> = (props) => {
    const { variant } = useTabVariant();

    if (variant === 'button') {
        return <ButtonTabItem {...(props as ButtonTabItemProps)} />;
    }

    return <BaseTabItem {...(props as BaseTabItemProps)} />;
};

type TabCompound = React.FC<TabProps> & {
    Item: React.FC<TabItemProps>;
};

const Tab = Object.assign(TabRoot, {
    Item: TabItem,
}) as TabCompound;

export default Tab;
