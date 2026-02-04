import React from 'react';
import classNames from 'classnames';
import styles from './BaseTextArea.module.scss';

import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import type { CSSLength } from '@/shared/types';
import { toCssUnit } from '@/shared/utils';

export type BaseTextAreaExtraProps = {
    height?: CSSLength;
};

export type BaseTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & BaseTextAreaExtraProps;

const BaseTextArea: React.FC<BaseTextAreaProps> = (props) => {
    const { className, style, height, value, defaultValue, ...rest } = props;

    // 텍스트 내의 불필요한 제어 문자(수직 탭 등)를 표준 줄바꿈으로 변경
    const normalizeText = (text: any) => {
        if (typeof text !== 'string') return text;
        return (
            text
                // eslint-disable-next-line no-control-regex
                .replace(new RegExp('\\u000B', 'g'), '\n') // Vertical Tab 제거
                .replace(new RegExp('\\u00A0', 'g'), ' ') // NBSP를 일반 공백으로
                .normalize('NFC')
        ); // 유니코드 정규화
    };

    const rootClassName = classNames(styles.BaseTextArea, className);

    const cssVariables: CSSVariables = {
        '--height': toCssUnit(height),
    };

    return (
        <textarea
            {...rest}
            value={value !== undefined ? normalizeText(value) : undefined}
            defaultValue={defaultValue !== undefined ? normalizeText(defaultValue) : undefined}
            className={rootClassName}
            style={{ ...cssVariables, ...style }}
        />
    );
};

export default BaseTextArea;
