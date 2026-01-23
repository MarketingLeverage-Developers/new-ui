import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './Image.module.scss';
import type { CSSLength } from '@/shared/types';
import { toCssUnit } from '@/shared/utils';
import DefaultFallbackImage from '@/shared/assets/images/logo.svg';

type ImageProps = React.HTMLAttributes<HTMLImageElement> & {
    src?: string;
    alt?: string;
    prefix?: string;
    fallbackSrc?: string;
    fallbackText?: string;
    width?: CSSLength;
    height?: CSSLength;
    fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    block?: boolean;
    radius?: CSSLength;
    loading?: 'lazy' | 'eager';
    className?: string;
    onClick?: React.MouseEventHandler<HTMLImageElement>;
    onLoad?: React.ReactEventHandler<HTMLImageElement>;
    onError?: React.ReactEventHandler<HTMLImageElement>;
};

/**
 * 핵심: CSS 변수 키를 허용하는 style 타입
 * - React.CSSProperties에 `--${string}` 형태의 키를 추가로 허용
 */
type CSSVarStyle = React.CSSProperties & Record<`--${string}`, string | number | undefined>;

export const Image: React.FC<ImageProps> = ({
    src,
    alt,
    prefix,
    fallbackSrc = DefaultFallbackImage,
    fallbackText = '이미지 표시 불가',
    width,
    height,
    fit = 'cover',
    block = false,
    radius,
    loading = 'lazy',
    className,
    onClick,
    onLoad,
    onError,
    style,
    ...props
}) => {
    const normalizedSrc = typeof src === 'string' ? src.trim() : '';
    const normalizedPrefix = typeof prefix === 'string' && prefix.trim().length > 0 ? prefix.trim() : undefined;
    const isAbsolute = /^([a-z][a-z0-9+.-]*:)?\/\//i.test(normalizedSrc) || /^data:|^blob:/i.test(normalizedSrc);
    const isAssetPath =
        normalizedSrc.startsWith('/assets/') ||
        normalizedSrc.startsWith('/src/') ||
        normalizedSrc.startsWith('/@fs/');
    const needsPrefix = Boolean(normalizedSrc) && !isAbsolute && !isAssetPath;
    const shouldPrefix =
        Boolean(normalizedPrefix) &&
        needsPrefix &&
        !normalizedSrc.startsWith(normalizedPrefix ?? '');
    const joinPrefix = (base: string, path: string) => {
        const trimmedBase = base.replace(/\/+$/, '');
        const normalizedPath = path.startsWith('/') ? path : `/${path}`;
        const isApiPath = /^\/api(\/|$)/.test(normalizedPath);
        if (trimmedBase.endsWith('/api') && isApiPath) {
            return `${trimmedBase}${normalizedPath.slice(4)}`;
        }
        return `${trimmedBase}${normalizedPath}`;
    };
    const resolvedSrc =
        shouldPrefix && normalizedPrefix ? joinPrefix(normalizedPrefix, normalizedSrc) : normalizedSrc;

    const [currentSrc, setCurrentSrc] = useState(resolvedSrc);
    const [didFallback, setDidFallback] = useState(false);
    const isTestEnv = import.meta.env.MODE !== 'production';

    useEffect(() => {
        setCurrentSrc(resolvedSrc);
        setDidFallback(false);
    }, [resolvedSrc, fallbackSrc]);

    const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
        if (fallbackSrc && !didFallback && currentSrc !== fallbackSrc) {
            setDidFallback(true);
            setCurrentSrc(fallbackSrc);
        }
        onError?.(e);
    };

    // 커스텀 CSS 변수를 안전하게 담을 수 있는 타입으로 선언
    const cssVars: CSSVarStyle = {
        '--width': toCssUnit(width),
        '--height': toCssUnit(height),
        '--radius': toCssUnit(radius),
        '--fit': fit,
    };

    const isFallback = Boolean(fallbackSrc) && currentSrc === fallbackSrc;
    const showFallbackText = isTestEnv && isFallback && Boolean(fallbackText);
    const shouldRender = Boolean(resolvedSrc) && (normalizedPrefix || !needsPrefix);

    if (!shouldRender) return null;

    if (showFallbackText) {
        return (
            <span
                {...props}
                role="img"
                aria-label={alt ?? fallbackText}
                className={classNames(styles.Image, { [styles.Block]: block }, styles.FallbackText, className)}
                style={{ ...cssVars, ...style }}
                onClick={onClick}
            >
                {fallbackText}
            </span>
        );
    }

    return (
        <img
            {...props}
            src={currentSrc}
            alt={alt ?? ''}
            loading={loading}
            className={classNames(styles.Image, { [styles.Block]: block }, className)}
            style={{ ...cssVars, ...style }}
            onClick={onClick}
            onLoad={onLoad}
            onError={handleError}
        />
    );
};
