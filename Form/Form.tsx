// Form.tsx
import React from 'react';
import styles from './Form.module.scss';
import { GroupLabel, Label, SubTitle, Title } from './components';
import type { CSSLength } from '@/shared/types';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';

type FormProps = {
    maxWidth?: CSSLength;
} & React.HTMLAttributes<HTMLDivElement>; // ✅ HTMLFormElement 기준으로 수정

const Form = ({ maxWidth, style, ...props }: FormProps) => {
    const cssVariables: CSSVariables = {
        '--max-width': toCssUnit(maxWidth),
    };

    // ✅ <form> 태그로 변경
    return <div {...props} className={styles.Form} style={{ ...cssVariables, ...style }} />;
};

export default Form;

Form.GroupLabel = GroupLabel;
Form.Label = Label;
Form.SubTitle = SubTitle;
Form.Title = Title;
