import React from 'react';
import classNames from 'classnames';
import Select, { useSelect } from '../../../shared/headless/Select/Select';
import styles from './SectionFieldTab.module.scss';

const noop = () => undefined;

type SectionFieldTabCssProperties = React.CSSProperties & {
    '--granter-section-field-tab-min-item-width'?: string;
};

export type SectionFieldTabProps<T extends string = string> = {
    children: React.ReactNode;
    value?: T;
    defaultValue?: T;
    onChange?: (nextValue: T) => void;
    full?: boolean;
    wrap?: boolean;
    minItemWidth?: number | string;
    className?: string;
};

export type SectionFieldTabItemProps<T extends string = string> = {
    value: T;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
};

const SectionFieldTabItem = <T extends string>({
    value,
    children,
    disabled = false,
    className,
}: SectionFieldTabItemProps<T>) => {
    const { selectValue, changeSelectValue } = useSelect();
    const isActive = value === selectValue;

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            className={classNames(styles.Item, className)}
            data-active={isActive ? 'true' : 'false'}
            disabled={disabled}
            onClick={() => {
                if (disabled) return;
                changeSelectValue(value);
            }}
        >
            {children}
        </button>
    );
};

type SectionFieldTabComponent = (<T extends string = string>(props: SectionFieldTabProps<T>) => React.ReactElement) & {
    Item: typeof SectionFieldTabItem;
};

const toCssLength = (value?: number | string) => {
    if (value === undefined) return undefined;
    return typeof value === 'number' ? `${value}px` : value;
};

const SectionFieldTab = (<T extends string = string>({
    children,
    value,
    defaultValue,
    onChange = noop,
    full = true,
    wrap = false,
    minItemWidth,
    className,
}: SectionFieldTabProps<T>) => {
    const cssVariables: SectionFieldTabCssProperties = {
        '--granter-section-field-tab-min-item-width': toCssLength(minItemWidth),
    };

    return (
        <Select
            value={value}
            defaultValue={defaultValue}
            onChange={(nextValue) => onChange(nextValue as T)}
        >
            <div
                role="tablist"
                className={classNames(styles.Root, className)}
                style={cssVariables}
                data-full={full ? 'true' : 'false'}
                data-wrap={wrap ? 'true' : 'false'}
            >
                {children}
            </div>
        </Select>
    );
}) as SectionFieldTabComponent;

SectionFieldTab.Item = SectionFieldTabItem;

export default SectionFieldTab;
