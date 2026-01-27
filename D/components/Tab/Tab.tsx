import React, { createContext, useContext } from 'react';

import BaseTab, { type BaseTabExtraProps } from './components/BaseTab/components/BaseTab/BaseTab';
import type { BaseTabItemProps } from './components/BaseTab/components/BaseTab/components/BaseTabItem/BaseTabItem';
import BaseTabItem from './components/BaseTab/components/BaseTab/components/BaseTabItem/BaseTabItem';

import type Select from '@/shared/headless/Select/Select';

import ButtonTab, { type ButtonTabExtraProps } from './components/ButtonTab/components/ButtonTab/ButtonTab';
import type { ButtonTabItemProps } from './components/ButtonTab/components/ButtonTab/components/ButtonTabItem/ButtonTabItem';
import ButtonTabItem from './components/ButtonTab/components/ButtonTab/components/ButtonTabItem/ButtonTabItem';

import RoundedTab from './components/RoundedTab/RoundedTab';
import type { RoundedTabItemProps } from './components/RoundedTab/components/Item';

import UnderlineTab from './components/UnderlineTab/UnderlineTab';
import type { UnderlineTabItemProps } from './components/UnderlineTab/components/Item';

import IconTab from './components/IconTab/IconTab';
import type { IconTabItemProps } from './components/IconTab/components/Item';

export type TabVariant = 'base' | 'button' | 'rounded' | 'underline' | 'icon';

export type TabCommonProps = React.ComponentProps<typeof Select>;

export type TabProps =
    | ({ variant: 'base' } & TabCommonProps & BaseTabExtraProps)
    | ({ variant: 'button' } & TabCommonProps & ButtonTabExtraProps)
    | ({ variant: 'rounded' } & TabCommonProps)
    | ({ variant: 'underline' } & TabCommonProps)
    | ({ variant: 'icon' } & TabCommonProps);

/** Tab 내부에서 variant 공유 */
type TabVariantContextValue = {
    variant: TabVariant;
};

const TabVariantContext = createContext<TabVariantContextValue | null>(null);

const useTabVariant = () => {
    const ctx = useContext(TabVariantContext);
    if (!ctx) {
        throw new Error("Tab.Item must be used inside <Tab variant='base' | 'button' | 'rounded' | 'underline' | 'icon'>");
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

    if (variant === 'rounded') {
        return (
            <TabVariantContext.Provider value={{ variant }}>
                <RoundedTab {...(rest as TabCommonProps)} />
            </TabVariantContext.Provider>
        );
    }

    if (variant === 'underline') {
        return (
            <TabVariantContext.Provider value={{ variant }}>
                <UnderlineTab {...(rest as TabCommonProps)} />
            </TabVariantContext.Provider>
        );
    }

    if (variant === 'icon') {
        return (
            <TabVariantContext.Provider value={{ variant }}>
                <IconTab {...(rest as TabCommonProps)} />
            </TabVariantContext.Provider>
        );
    }

    return (
        <TabVariantContext.Provider value={{ variant: 'base' }}>
            <BaseTab {...(rest as TabCommonProps & BaseTabExtraProps)} />
        </TabVariantContext.Provider>
    );
};

/**
 * ✅ 사용처에서 Tab.Item 하나로 통일
 * - variant를 Context로 읽고 알맞은 Item 렌더
 */
export type TabItemProps =
    | BaseTabItemProps
    | ButtonTabItemProps
    | RoundedTabItemProps
    | UnderlineTabItemProps
    | IconTabItemProps;

const TabItem: React.FC<TabItemProps> = (props) => {
    const { variant } = useTabVariant();

    if (variant === 'button') return <ButtonTabItem {...(props as ButtonTabItemProps)} />;
    if (variant === 'rounded') return <RoundedTabItem {...(props as RoundedTabItemProps)} />;
    if (variant === 'underline') return <UnderlineTabItem {...(props as UnderlineTabItemProps)} />;
    if (variant === 'icon') return <IconTabItem {...(props as IconTabItemProps)} />;

    return <BaseTabItem {...(props as BaseTabItemProps)} />;
};

type TabCompound = React.FC<TabProps> & {
    Item: React.FC<TabItemProps>;
};

const Tab = Object.assign(TabRoot, {
    Item: TabItem,
}) as TabCompound;

export default Tab;
