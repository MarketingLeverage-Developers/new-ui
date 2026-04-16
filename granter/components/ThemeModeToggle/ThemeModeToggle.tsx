import React from 'react';
import classNames from 'classnames';
import { FiMoon, FiStar, FiSun } from 'react-icons/fi';
import styles from './ThemeModeToggle.module.scss';
import type { ThemeMode } from '@/shared/recoil/theme/atom';

export type ThemeModeToggleTheme = ThemeMode;

export type ThemeModeToggleProps = {
    theme: ThemeModeToggleTheme;
    onThemeChange: (nextTheme: ThemeModeToggleTheme) => void;
    size?: 'sm' | 'md';
    disabled?: boolean;
    className?: string;
    ariaLabel?: string;
};

const THEME_OPTIONS: Array<{ value: ThemeModeToggleTheme; label: string }> = [
    { value: 'light', label: '라이트 모드' },
    { value: 'dark', label: '다크 모드' },
    { value: 'darker', label: '진한 다크 모드' },
];

const ThemeModeToggle = ({
    theme,
    onThemeChange,
    size = 'sm',
    disabled = false,
    className,
    ariaLabel = '테마 모드 선택',
}: ThemeModeToggleProps) => {
    const handleOptionClick = (nextTheme: ThemeModeToggleTheme) => {
        if (disabled || nextTheme === theme) return;
        onThemeChange(nextTheme);
    };

    return (
        <div
            className={classNames(styles.Root, className)}
            data-size={size}
            data-theme-mode={theme}
            data-disabled={disabled ? 'true' : 'false'}
            role="radiogroup"
            aria-label={ariaLabel}
        >
            <span className={styles.Track} aria-hidden="true">
                <span className={styles.Indicator} />
                {THEME_OPTIONS.map((option) => {
                    const isActive = option.value === theme;
                    const isDarkerOption = option.value === 'darker';

                    return (
                        <button
                            key={option.value}
                            type="button"
                            className={styles.Option}
                            data-theme-option={option.value}
                            data-active={isActive ? 'true' : 'false'}
                            onClick={() => handleOptionClick(option.value)}
                            disabled={disabled}
                            role="radio"
                            aria-checked={isActive}
                            aria-label={option.label}
                        >
                            <span className={classNames(styles.Icon, isDarkerOption && styles.IconDarker)}>
                                {option.value === 'light' ? (
                                    <FiSun size={12} />
                                ) : option.value === 'darker' ? (
                                    <FiStar size={12} />
                                ) : (
                                    <FiMoon size={12} />
                                )}
                            </span>
                            <span className={styles.SrOnly}>{option.label}</span>
                        </button>
                    );
                })}
            </span>
        </div>
    );
};

ThemeModeToggle.displayName = 'ThemeModeToggle';

export default ThemeModeToggle;
