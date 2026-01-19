import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import styles from './StarRating.module.scss';

import type { RatingCommonProps, RatingValue } from '../../Rating';

export type StarRatingExtraProps = {
    size?: number;
};

type StarRatingProps = RatingCommonProps & StarRatingExtraProps;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const StarRating: React.FC<StarRatingProps> = (props) => {
    const {
        value,
        defaultValue = 0,
        onChange,

        max = 5,

        disabled = false,
        readOnly = false,

        // ✅ 요구사항: 40x40
        size = 40,

        className,
    } = props;

    const isControlled = value !== undefined;

    const [inner, setInner] = useState<RatingValue>(() => clamp(defaultValue, 0, max));
    const current = (isControlled ? clamp(value as number, 0, max) : inner) as RatingValue;

    const commit = useCallback(
        (next: RatingValue) => {
            const clamped = clamp(next, 0, max);
            if (!isControlled) setInner(clamped);
            onChange?.(clamped);
        },
        [isControlled, max, onChange]
    );

    const rootClassName = classNames(
        styles.StarRating,
        {
            [styles.Disabled]: disabled,
            [styles.ReadOnly]: readOnly,
        },
        className
    );

    const items = useMemo(() => Array.from({ length: max }, (_, i) => i + 1), [max]);

    const handleClick = useCallback(
        (v: number) => {
            if (disabled || readOnly) return;
            commit(v);
        },
        [commit, disabled, readOnly]
    );

    return (
        <div className={rootClassName} role="radiogroup" aria-disabled={disabled}>
            {items.map((v) => {
                const active = v <= current;

                return (
                    <button
                        key={v}
                        type="button"
                        className={classNames(styles.StarButton, { [styles.Active]: active })}
                        onClick={() => handleClick(v)}
                        disabled={disabled}
                        aria-label={`${v}점`}
                        aria-checked={v === current}
                        role="radio"
                        style={{ width: size, height: size }}
                    >
                        {/* ✅ span도 size를 따라가도록 */}
                        <span className={styles.Star} aria-hidden style={{ width: size, height: size }} />
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;
