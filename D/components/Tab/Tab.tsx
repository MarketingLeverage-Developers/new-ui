import React, { createContext, useContext } from 'react';

import BaseTab, { type BaseTabExtraProps } from './components/BaseTab/components/BaseTab/BaseTab';
import type { BaseTabItemProps } from './components/BaseTab/components/BaseTab/components/BaseTabItem/BaseTabItem';
import BaseTabItem from './components/BaseTab/components/BaseTab/components/BaseTabItem/BaseTabItem';

import type Select from '@/shared/headless/Select/Select';

import ButtonTab, { type ButtonTabExtraProps } from './components/ButtonTab/components/ButtonTab/ButtonTab';
import type { ButtonTabItemProps } from './components/ButtonTab/components/ButtonTab/components/ButtonTabItem/ButtonTabItem';
import ButtonTabItem from './components/ButtonTab/components/ButtonTab/components/ButtonTabItem/ButtonTabItem';

export type TabVariant = 'base' | 'button';

export type TabCommonProps = React.ComponentProps<typeof Select>;

export type TabProps =
    | ({ variant: 'base' } & TabCommonProps & BaseTabExtraProps)
    | ({ variant: 'button' } & TabCommonProps & ButtonTabExtraProps);

/** Tab 내부에서 variant 공유 */
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

/**
 * ✅ 사용처에서 Tab.Item 하나로 통일
 * - variant를 Context로 읽고 알맞은 Item 렌더
 */
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
