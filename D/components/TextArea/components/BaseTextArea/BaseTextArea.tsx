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
    const { className, style, height, ...rest } = props;

    const rootClassName = classNames(styles.BaseTextArea, className);

    const cssVariables: CSSVariables = {
        '--height': toCssUnit(height),
    };

    return <textarea {...rest} className={rootClassName} style={{ ...cssVariables, ...style }} />;
};

export default BaseTextArea;
