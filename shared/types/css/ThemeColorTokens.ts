// src/shared/styles/tokens.ts
export type GrayScaleToken = 'White1' | 'Black1' | 'Gray1' | 'Gray2' | 'Gray3' | 'Gray4' | 'Gray5' | 'Gray6' | 'Gray7';
export type BrandAccentToken = 'Blue1' | 'Blue2';
export type StatusToken = 'Red1' | 'Red2' | 'Green1' | 'Green2';
export type PrimaryToken = 'Primary1' | 'Primary2' | 'Primary3' | 'Primary4' | 'Primary5' | 'Primary6';
export type GradientToken = 'Gradient1' | 'Gradient2';
export type ComplementaryToken = 'Complementary1' | 'Complementary2'; // 보색 추가

export type ThemeColorToken =
    | GrayScaleToken
    | BrandAccentToken
    | StatusToken
    | PrimaryToken
    | GradientToken
    | ComplementaryToken;
export type ThemeColorVar = `var(--${ThemeColorToken})`;
