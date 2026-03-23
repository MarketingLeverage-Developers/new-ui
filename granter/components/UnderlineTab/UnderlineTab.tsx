import React from 'react';
import classNames from 'classnames';
import Select, { useSelect } from '../../../shared/headless/Select/Select';
import styles from './UnderlineTab.module.scss';

const noop = () => undefined;

export type UnderlineTabProps<T extends string = string> = {
    children: React.ReactNode;
    value?: T;
    defaultValue?: T;
    className?: string;
    onChange?: (nextKey: T) => void;
    scrollable?: boolean;
    fullWidthUnderline?: boolean;
};

export type UnderlineTabItemProps<T extends string = string> = {
    value: T;
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
};

const UnderlineTabItem = <T extends string>({
    value,
    children,
    disabled,
    className,
}: UnderlineTabItemProps<T>) => {
    const { selectValue, changeSelectValue } = useSelect();

    return (
        <button
            type="button"
            className={classNames(styles.Item, className)}
            data-active={value === selectValue ? 'true' : 'false'}
            disabled={disabled}
            onClick={() => {
                if (disabled) return;
                changeSelectValue(value);
            }}
        >
            <span className={styles.ItemInner}>
                <span className={styles.Label}>{children}</span>
            </span>
        </button>
    );
};

type UnderlineTabComponent = (<T extends string = string>(props: UnderlineTabProps<T>) => React.ReactElement) & {
    Item: typeof UnderlineTabItem;
};

const UnderlineTab = (<T extends string>({
    children,
    value,
    defaultValue,
    className,
    onChange = noop,
    scrollable = false,
    fullWidthUnderline = false,
}: UnderlineTabProps<T>) => (
    <Select
        value={value}
        defaultValue={defaultValue}
        onChange={(nextValue) => onChange(nextValue as T)}
    >
        <div
            className={classNames(styles.UnderlineTab, className)}
            data-scrollable={scrollable ? 'true' : 'false'}
            data-full-width-underline={fullWidthUnderline ? 'true' : 'false'}
        >
            {children}
        </div>
    </Select>
)) as UnderlineTabComponent;

export default UnderlineTab;

UnderlineTab.Item = UnderlineTabItem;
