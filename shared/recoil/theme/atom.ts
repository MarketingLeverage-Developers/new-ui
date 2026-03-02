import { atom } from 'recoil';

export type ThemeMode = 'light' | 'dark';

const getInitialTheme = (): ThemeMode => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('theme-mode');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const themeState = atom<ThemeMode>({
    key: 'commonThemeState',
    default: getInitialTheme(),
    effects: [
        ({ onSet }) => {
            onSet((newValue) => {
                localStorage.setItem('theme-mode', newValue);
            });
        },
    ],
});
