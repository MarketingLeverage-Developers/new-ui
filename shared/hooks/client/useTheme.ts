import { useRecoilState } from 'recoil';
import { themeState } from '../../recoil/theme/atom';
import { useCallback } from 'react';

export const useTheme = () => {
    const [theme, setTheme] = useRecoilState(themeState);

    const toggleTheme = useCallback(() => {
        const nextTheme = theme === 'light' ? 'dark' : 'light';

        // View Transition API (Chrome 111+)
        if (
            typeof document !== 'undefined' &&
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (document as any).startViewTransition &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (document as any).startViewTransition(() => {
                setTheme(nextTheme);
            });
        } else {
            setTheme(nextTheme);
        }
    }, [theme, setTheme]);

    return {
        theme,
        setTheme,
        toggleTheme,
    };
};
