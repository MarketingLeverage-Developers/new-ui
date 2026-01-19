import React from 'react';

import StarRating, { type StarRatingExtraProps } from './components/StarRating/StarRating';

export type RatingVariant = 'star';

export type RatingValue = number;

export type RatingCommonProps = {
    value?: RatingValue;
    defaultValue?: RatingValue;
    onChange?: (next: RatingValue) => void;

    max?: number;

    disabled?: boolean;
    readOnly?: boolean;

    className?: string;
};

export type RatingProps =
    | ({ variant: 'star' } & RatingCommonProps & StarRatingExtraProps)
    | ({ variant: 'star' } & RatingCommonProps);

const Rating = (props: RatingProps) => {
    const { variant, ...rest } = props;

    if (variant === 'star') {
        return <StarRating {...rest} />;
    }

    return null;
};

export default Rating;
