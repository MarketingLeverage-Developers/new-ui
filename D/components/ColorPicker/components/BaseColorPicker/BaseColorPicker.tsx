import React, { type ReactNode } from 'react';
import classNames from 'classnames';
import styles from './BaseColorPicker.module.scss';
import type { ColorPickerCommonProps } from '../../ColorPicker';

export type BaseColorPickerStatus = 'default' | 'error' | 'success';

export type BaseColorPickerExtraProps = {
    status?: BaseColorPickerStatus;
    message?: string;
    value?: string;
    onChange?: (value: string) => void;
    prefix?: ReactNode;
    suffix?: ReactNode;
};

type BaseColorPickerProps = ColorPickerCommonProps & BaseColorPickerExtraProps;

const normalizeHex = (value?: string) => {
    if (!value) return '';
    const trimmed = value.trim();
    if (/^#[0-9a-fA-F]{6}$/.test(trimmed)) return trimmed;
    if (/^#[0-9a-fA-F]{3}$/.test(trimmed)) {
        const r = trimmed[1];
        const g = trimmed[2];
        const b = trimmed[3];
        return `#${r}${r}${g}${g}${b}${b}`;
    }
    if (/^[0-9a-fA-F]{6}$/.test(trimmed)) return `#${trimmed}`;
    if (/^[0-9a-fA-F]{3}$/.test(trimmed)) {
        const r = trimmed[0];
        const g = trimmed[1];
        const b = trimmed[2];
        return `#${r}${r}${g}${g}${b}${b}`;
    }
    return '';
};

const BaseColorPicker: React.FC<BaseColorPickerProps> = (props) => {
    const {
        status = 'default',
        message,
        value = '',
        onChange,
        disabled,
        className,
        prefix,
        suffix,
        ...inputProps
    } = props;

    const wrapperClassName = classNames(
        styles.BaseColorPicker,
        status === 'error' && styles.Error,
        status === 'success' && styles.Success,
        disabled && styles.Disabled,
        className
    );

    const safeColor = normalizeHex(value) || '#000000';

    return (
        <div className={wrapperClassName}>
            {prefix ? <div className={styles.Prefix}>{prefix}</div> : null}

            <input
                type="color"
                className={styles.ColorInput}
                value={safeColor}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={disabled}
                aria-label="color"
            />

            <input
                {...inputProps}
                className={styles.TextInput}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={disabled}
                placeholder={inputProps.placeholder ?? '#000000'}
            />

            {suffix ? <div className={styles.Suffix}>{suffix}</div> : null}

            {message ? <span className={styles.Message}>{message}</span> : null}
        </div>
    );
};

export default BaseColorPicker;
