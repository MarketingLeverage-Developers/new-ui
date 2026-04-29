import { useRecoilState } from 'recoil';
import { themeState } from '@/shared/recoil/theme/atom';
import { useCallback } from 'react';
import type { ThemeMode } from '@/shared/recoil/theme/atom';

const THEME_ORDER: ThemeMode[] = ['light', 'dark', 'darker'];

export const useTheme = () => {
    const [theme, setThemeState] = useRecoilState(themeState);

    const applyTheme = useCallback(
        (nextTheme: ThemeMode) => {
            setThemeState(nextTheme);
        },
        [setThemeState]
    );

    const toggleTheme = useCallback(() => {
        const currentIndex = THEME_ORDER.indexOf(theme);
        const nextTheme = THEME_ORDER[(currentIndex + 1) % THEME_ORDER.length] ?? 'light';
        applyTheme(nextTheme);
    }, [theme, applyTheme]);

    const changeTheme = useCallback(
        (nextTheme: ThemeMode) => {
            if (theme === nextTheme) return;
            applyTheme(nextTheme);
        },
        [theme, applyTheme]
    );

    return {
        theme,
        setTheme: changeTheme,
        changeTheme,
        toggleTheme,
    };
};
