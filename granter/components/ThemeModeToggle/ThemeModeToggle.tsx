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
    ariaLabel = '테마 모드 토글',
}: ThemeModeToggleProps) => {
    const currentThemeIndex = THEME_OPTIONS.findIndex((option) => option.value === theme);
    const safeCurrentThemeIndex = currentThemeIndex >= 0 ? currentThemeIndex : 0;
    const currentThemeOption = THEME_OPTIONS[safeCurrentThemeIndex]!;
    const nextThemeOption = THEME_OPTIONS[(safeCurrentThemeIndex + 1) % THEME_OPTIONS.length]!;
    const screenReaderMessage = `${currentThemeOption.label}. 클릭하면 ${nextThemeOption.label}로 전환됩니다.`;

    const handleToggleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled) return;
        const root = document.documentElement;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX > 0 ? event.clientX : rect.left + rect.width / 2;
        const y = event.clientY > 0 ? event.clientY : rect.top + rect.height / 2;

        root.style.setProperty('--theme-reveal-x', `${x}px`);
        root.style.setProperty('--theme-reveal-y', `${y}px`);
        root.dataset.themeReveal = 'radial';

        onThemeChange(nextThemeOption.value);
    };

    const CurrentThemeIcon = currentThemeOption.value === 'light' ? FiSun : currentThemeOption.value === 'dark' ? FiMoon : FiStar;

    return (
        <button
            type="button"
            className={classNames(styles.Root, className)}
            data-size={size}
            data-theme-mode={theme}
            aria-label={`${ariaLabel}. ${screenReaderMessage}`}
            onClick={handleToggleClick}
            disabled={disabled}
        >
            <span className={styles.Track} aria-hidden="true">
                <span className={styles.Thumb}>
                    <span className={classNames(styles.Icon, currentThemeOption.value === 'darker' && styles.IconDarker)}>
                        <CurrentThemeIcon size={12} />
                    </span>
                </span>
            </span>
            <span className={styles.SrOnly}>{screenReaderMessage}</span>
        </button>
    );
};

ThemeModeToggle.displayName = 'ThemeModeToggle';

export default ThemeModeToggle;
