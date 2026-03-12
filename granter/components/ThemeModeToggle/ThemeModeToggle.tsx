import React from 'react';
import classNames from 'classnames';
import { FiMoon, FiSun } from 'react-icons/fi';
import styles from './ThemeModeToggle.module.scss';

export type ThemeModeToggleTheme = 'light' | 'dark';

export type ThemeModeToggleProps = {
    theme: ThemeModeToggleTheme;
    onToggle: () => void;
    size?: 'sm' | 'md';
    disabled?: boolean;
    className?: string;
    ariaLabel?: string;
};

const ThemeModeToggle = ({
    theme,
    onToggle,
    size = 'sm',
    disabled = false,
    className,
    ariaLabel = '다크모드 토글',
}: ThemeModeToggleProps) => (
    <button
        type="button"
        className={classNames(styles.Root, className)}
        data-size={size}
        data-theme-mode={theme}
        onClick={onToggle}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-pressed={theme === 'dark'}
    >
        <span className={styles.Track} aria-hidden="true">
            <span className={styles.Thumb}>
                <span className={styles.Icon}>
                    {theme === 'dark' ? <FiMoon size={12} /> : <FiSun size={12} />}
                </span>
            </span>
        </span>
        <span className={styles.SrOnly}>{theme === 'dark' ? '다크 모드' : '라이트 모드'}</span>
    </button>
);

export default ThemeModeToggle;
