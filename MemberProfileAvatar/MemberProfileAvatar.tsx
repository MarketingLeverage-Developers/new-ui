import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import styles from './MemberProfileAvatar.module.scss';
import { toCssUnit } from '../shared/utils';
import type { CSSLength } from '../shared/types';

export type MemberProfileAvatarMode = 'avatar' | 'icon';

type MemberProfileAvatarProps = React.HTMLAttributes<HTMLDivElement> & {
    name?: string | null;
    src?: string | null;
    fallbackText?: string | null;
    size?: CSSLength;
    fontSize?: CSSLength;
    alt?: string;
    mode?: MemberProfileAvatarMode;
};

type CSSVarStyle = React.CSSProperties & Record<`--${string}`, string | number | undefined>;

const normalizeName = (name?: string | null) => String(name ?? '').trim();

const getFallbackText = (name: string) => {
    if (!name) return '?';
    return Array.from(name.replace(/\s+/g, ''))
        .slice(1, 2)
        .join('')
        .toUpperCase();
};

const getBackgroundColor = (name: string) => {
    const seed = name || 'member';
    let hash = 0;

    for (let index = 0; index < seed.length; index += 1) {
        hash = seed.charCodeAt(index) + ((hash << 5) - hash);
        hash |= 0;
    }

    const hue = Math.abs(hash) % 360;
    return `hsl(${hue} 65% 48%)`;
};

const MemberProfileAvatar = ({
    name,
    src,
    fallbackText,
    size = 24,
    fontSize,
    alt,
    mode = 'avatar',
    className,
    style,
    ...props
}: MemberProfileAvatarProps) => {
    const [hasImageError, setHasImageError] = useState(false);
    const normalizedName = useMemo(() => normalizeName(name), [name]);
    const imageSrc = typeof src === 'string' ? src.trim() : '';
    const showImage = imageSrc.length > 0 && !hasImageError;
    const resolvedFallbackText = useMemo(() => {
        const normalizedFallbackText = String(fallbackText ?? '').trim();

        return normalizedFallbackText || getFallbackText(normalizedName);
    }, [fallbackText, normalizedName]);
    const backgroundColor = useMemo(() => getBackgroundColor(normalizedName), [normalizedName]);
    const imageAlt = alt ?? `${normalizedName || 'member'} profile`;

    useEffect(() => {
        setHasImageError(false);
    }, [imageSrc]);

    const cssVariables: CSSVarStyle = {
        '--avatar-size': toCssUnit(size),
        '--avatar-font-size': toCssUnit(fontSize),
        '--avatar-bg-color': backgroundColor,
    };

    return (
        <div
            {...props}
            className={classNames(styles.MemberProfileAvatar, { [styles.Fallback]: !showImage }, className)}
            data-mode={mode}
            style={{ ...cssVariables, ...style }}
        >
            {showImage ? (
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className={styles.Image}
                    data-mode={mode}
                    onError={() => setHasImageError(true)}
                />
            ) : (
                <span className={styles.FallbackText}>{resolvedFallbackText}</span>
            )}
        </div>
    );
};

export default MemberProfileAvatar;
