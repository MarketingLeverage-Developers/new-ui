import React from 'react';
import classNames from 'classnames';
import styles from './Image.module.scss';
import type { CSSLength } from '@/shared/types';
import { toCssUnit } from '@/shared/utils';

type ImageProps = React.HTMLAttributes<HTMLImageElement> & {
    src: string;
    alt: string;
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
    ...props
}) => {
    // 커스텀 CSS 변수를 안전하게 담을 수 있는 타입으로 선언
    const cssVars: CSSVarStyle = {
        '--width': toCssUnit(width),
        '--height': toCssUnit(height),
        '--radius': toCssUnit(radius),
        '--fit': fit,
    };

    return (
        <img
            {...props}
            src={src}
            alt={alt}
            loading={loading}
            className={classNames(styles.Image, { [styles.Block]: block }, className)}
            style={cssVars}
            onClick={onClick}
            onLoad={onLoad}
            onError={onError}
        />
    );
};
