import React from 'react';
import classNames from 'classnames';
import { FiX } from 'react-icons/fi';
import styles from './EditableUnderlineTabs.module.scss';

export type EditableUnderlineTabsItem = {
    value: string;
    label: React.ReactNode;
    deletable?: boolean;
};

export type EditableUnderlineTabsProps = {
    value: string;
    items: EditableUnderlineTabsItem[];
    onChange: (value: string) => void;
    onDelete?: (value: string) => void;
    addLabel?: React.ReactNode;
    onAdd?: () => void;
    disabled?: boolean;
    className?: string;
};

const EditableUnderlineTabs = ({
    value,
    items,
    onChange,
    onDelete,
    addLabel,
    onAdd,
    disabled = false,
    className,
}: EditableUnderlineTabsProps) => (
    <div className={classNames(styles.Root, className)} role="tablist">
        {items.map((item) => {
            const active = value === item.value;

            return (
                <span
                    key={item.value}
                    className={classNames(styles.Item, { [styles.Active]: active })}
                    data-disabled={disabled ? 'true' : 'false'}
                >
                    <button
                        type="button"
                        className={styles.ItemButton}
                        role="tab"
                        aria-selected={active}
                        disabled={disabled}
                        onClick={() => onChange(item.value)}
                    >
                        <span className={styles.Label}>{item.label}</span>
                    </button>
                    {item.deletable && onDelete ? (
                        <button
                            type="button"
                            className={styles.DeleteButton}
                            disabled={disabled}
                            aria-label={`${String(item.label)} 제거`}
                            onClick={(event) => {
                                event.stopPropagation();
                                onDelete(item.value);
                            }}
                        >
                            <FiX size={14} />
                        </button>
                    ) : null}
                </span>
            );
        })}
        {addLabel && onAdd ? (
            <button
                type="button"
                className={classNames(styles.Item, styles.Add)}
                disabled={disabled}
                onClick={onAdd}
            >
                <span className={styles.Label}>{addLabel}</span>
            </button>
        ) : null}
    </div>
);

export default EditableUnderlineTabs;
