// src/shared/styles/theme.ts

import type { ThemeColorToken, ThemeColorVar } from '../../types/css/ThemeColorTokens';

export const getThemeColor = (name: ThemeColorToken): ThemeColorVar => `var(--${name})`;
