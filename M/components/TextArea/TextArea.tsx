import React, { type TextareaHTMLAttributes } from 'react';
import BaseTextArea, { type BaseTextAreaExtraProps } from './components/BaseTextArea/BaseTextArea';

export type TextAreaVariant = 'base' | 'rounded';

export type TextAreaCommonProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export type TextAreaProps = { variant: 'base' } & TextAreaCommonProps & BaseTextAreaExtraProps;

const TextArea = (props: TextAreaProps) => {
    const { variant, ...rest } = props;

    if (variant === 'base') {
        return <BaseTextArea {...rest} />;
    }

    return <BaseTextArea {...rest} />;
};

export default TextArea;
