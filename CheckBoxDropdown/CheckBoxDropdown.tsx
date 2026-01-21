// CheckBoxDropdown/CheckBoxDropdown.tsx
import React from 'react';
import classNames from 'classnames';

import styles from './CheckBoxDropdown.module.scss';

import Trigger from './components/Trigger/Trigger';
import Content from './components/Content/Content';
import Item from './components/Item/Item';

import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import type { ManySelectValue } from '@/shared/headless/ManySelect/ManySelect';
import ManySelect from '@/shared/headless/ManySelect/ManySelect';

import type { HexColor } from '@/shared/types/css/HexColor';
import { toCssUnit } from '@/shared/utils';

export interface CheckBoxDropdownContextType {
    disabled?: boolean;
}

const CheckBoxDropdownContext = React.createContext<CheckBoxDropdownContextType | undefined>(undefined);

export const useCheckBoxDropdownContext = () => {
    const ctx = React.useContext(CheckBoxDropdownContext);
    if (!ctx) throw new Error('useCheckBoxDropdownContext must be used within CheckBoxDropdownProvider');
    return ctx;
};

type CheckBoxDropdownProps = {
    children: React.ReactNode;

    /** ManySelect */
    defaultValue?: ManySelectValue;
    value?: ManySelectValue;
    onChange?: (next: ManySelectValue) => void;

    /** UI */
    bgColor?: HexColor;
    width?: number | string;
    full?: boolean;
    disabled?: boolean;
};

type CheckBoxDropdownComponent = React.FC<CheckBoxDropdownProps> & {
    Trigger: typeof Trigger;
    Content: typeof Content;
    Item: typeof Item;
};

const CheckBoxDropdown = (({
    children,
    defaultValue = [],
    value,
    onChange,
    width = '100%',
    bgColor = '#fff',
    disabled = false,
    full,
}: CheckBoxDropdownProps) => {
    const combinedBoxClassName = classNames(styles.Box, {
        [styles.Full]: full,
        [styles.Disabled]: disabled,
    });

    const cssVariables: React.CSSProperties = {
        '--Width': toCssUnit(width),
        '--BackgroundColor': bgColor,
    } as React.CSSProperties;

    return (
        <CheckBoxDropdownContext.Provider value={{ disabled }}>
            <ManySelect defaultValue={defaultValue} value={value} onChange={onChange}>
                <Dropdown>
                    <div className={combinedBoxClassName} style={cssVariables}>
                        {children}
                    </div>
                </Dropdown>
            </ManySelect>
        </CheckBoxDropdownContext.Provider>
    );
}) as CheckBoxDropdownComponent;

export default CheckBoxDropdown;

CheckBoxDropdown.Trigger = Trigger;
CheckBoxDropdown.Content = Content;
CheckBoxDropdown.Item = Item;
