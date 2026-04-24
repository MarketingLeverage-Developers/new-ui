import { useRecoilState } from 'recoil';
import { themeState } from '@/shared/recoil/theme/atom';
import { useCallback } from 'react';
import type { ThemeMode } from '@/shared/recoil/theme/atom';

const THEME_ORDER: ThemeMode[] = ['light', 'dark', 'darker'];
const THEME_REVEAL_INK_RGB: Record<ThemeMode, string> = {
    light: '247 182 77',
    dark: '104 145 214',
    darker: '136 116 214',
};

export const useTheme = () => {
    const [theme, setThemeState] = useRecoilState(themeState);

    const applyTheme = useCallback(
        (nextTheme: ThemeMode) => {
            const root = typeof document !== 'undefined' ? document.documentElement : null;
            const isRadialReveal = root?.dataset.themeReveal === 'radial';

            const clearRevealState = () => {
                if (!root) return;
                delete root.dataset.themeReveal;
                root.style.removeProperty('--theme-reveal-x');
                root.style.removeProperty('--theme-reveal-y');
                root.style.removeProperty('--theme-reveal-ink-rgb');
            };

            // View Transition API (Chrome 111+)
            if (
                typeof document !== 'undefined' &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (document as any).startViewTransition &&
                !window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const transition = (document as any).startViewTransition(() => {
                    setThemeState(nextTheme);
                });

                if (isRadialReveal && root && transition?.ready) {
                    root.style.setProperty('--theme-reveal-ink-rgb', THEME_REVEAL_INK_RGB[nextTheme]);

                    transition.ready
                        .then(() => {
                            const x = Number.parseFloat(root.style.getPropertyValue('--theme-reveal-x')) || window.innerWidth / 2;
                            const y = Number.parseFloat(root.style.getPropertyValue('--theme-reveal-y')) || window.innerHeight / 2;
                            const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
                            const firstRadius = endRadius * 0.22;
                            const secondRadius = endRadius * 0.58;
                            const thirdRadius = endRadius * 0.9;
                            const finalRadius = endRadius * 1.04;

                            root.animate(
                                [
                                    {
                                        clipPath: `circle(8px at ${x}px ${y}px)`,
                                        filter: 'blur(24px) saturate(1.28) brightness(1.08) drop-shadow(0 0 44px rgba(var(--theme-reveal-ink-rgb), 0.34))',
                                        transform: 'scale(1.02)',
                                        opacity: 0.56,
                                    },
                                    {
                                        offset: 0.26,
                                        clipPath: `circle(${firstRadius}px at ${x}px ${y}px)`,
                                        filter: 'blur(15px) saturate(1.18) brightness(1.04) drop-shadow(0 0 30px rgba(var(--theme-reveal-ink-rgb), 0.27))',
                                        transform: 'scale(1.012)',
                                        opacity: 0.82,
                                    },
                                    {
                                        offset: 0.6,
                                        clipPath: `circle(${secondRadius}px at ${x}px ${y}px)`,
                                        filter: 'blur(8px) saturate(1.1) brightness(1.01) drop-shadow(0 0 18px rgba(var(--theme-reveal-ink-rgb), 0.18))',
                                        transform: 'scale(1.006)',
                                        opacity: 0.94,
                                    },
                                    {
                                        offset: 0.86,
                                        clipPath: `circle(${thirdRadius}px at ${x}px ${y}px)`,
                                        filter: 'blur(2.8px) saturate(1.04) brightness(1.005) drop-shadow(0 0 10px rgba(var(--theme-reveal-ink-rgb), 0.1))',
                                        transform: 'scale(1.002)',
                                        opacity: 0.985,
                                    },
                                    {
                                        clipPath: `circle(${finalRadius}px at ${x}px ${y}px)`,
                                        filter: 'blur(0px) saturate(1) brightness(1) drop-shadow(0 0 0 rgba(var(--theme-reveal-ink-rgb), 0))',
                                        transform: 'scale(1)',
                                        opacity: 1,
                                    },
                                ],
                                {
                                    duration: 760,
                                    easing: 'cubic-bezier(0.2, 0.9, 0.22, 1)',
                                    fill: 'both',
                                    pseudoElement: '::view-transition-new(root)',
                                } as KeyframeAnimationOptions
                            );

                            root.animate(
                                [
                                    {
                                        opacity: 1,
                                        filter: 'blur(0px) saturate(1)',
                                        transform: 'scale(1)',
                                    },
                                    {
                                        offset: 0.55,
                                        opacity: 0.92,
                                        filter: 'blur(0.45px) saturate(0.97)',
                                        transform: 'scale(0.998)',
                                    },
                                    {
                                        opacity: 0.88,
                                        filter: 'blur(0.8px) saturate(0.94)',
                                        transform: 'scale(0.997)',
                                    },
                                ],
                                {
                                    duration: 760,
                                    easing: 'cubic-bezier(0.2, 0.9, 0.22, 1)',
                                    fill: 'both',
                                    pseudoElement: '::view-transition-old(root)',
                                } as KeyframeAnimationOptions
                            );
                        })
                        .catch(() => undefined);
                }

                if (isRadialReveal) {
                    if (transition?.finished) {
                        transition.finished.finally(() => {
                            clearRevealState();
                        });
                    } else {
                        window.setTimeout(() => {
                            clearRevealState();
                        }, 900);
                    }
                }
            } else {
                setThemeState(nextTheme);
                clearRevealState();
            }
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
