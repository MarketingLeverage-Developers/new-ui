import React from 'react';
import classNames from 'classnames';
import Select, { useSelect } from '../../../shared/headless/Select/Select';
import styles from './RoundedSegmentTab.module.scss';

const noop = () => undefined;

export type RoundedSegmentTabProps<T extends string = string> = {
    children: React.ReactNode;
    value?: T;
    defaultValue?: T;
    onChange?: (nextValue: T) => void;
    full?: boolean;
    className?: string;
};

export type RoundedSegmentTabItemProps<T extends string = string> = {
    value: T;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
};

const RoundedSegmentTabItem = <T extends string>({
    value,
    children,
    disabled = false,
    className,
}: RoundedSegmentTabItemProps<T>) => {
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

type RoundedSegmentTabComponent = (<T extends string = string>(props: RoundedSegmentTabProps<T>) => React.ReactElement) & {
    Item: typeof RoundedSegmentTabItem;
};

const RoundedSegmentTab = (<T extends string = string>({
    children,
    value,
    defaultValue,
    onChange = noop,
    full = true,
    className,
}: RoundedSegmentTabProps<T>) => (
    <Select
        value={value}
        defaultValue={defaultValue}
        onChange={(nextValue) => onChange(nextValue as T)}
    >
        <div
            role="tablist"
            className={classNames(styles.RoundedSegmentTab, className)}
            data-full={full ? 'true' : 'false'}
        >
            {children}
        </div>
    </Select>
)) as RoundedSegmentTabComponent;

export default RoundedSegmentTab;

RoundedSegmentTab.Item = RoundedSegmentTabItem;
