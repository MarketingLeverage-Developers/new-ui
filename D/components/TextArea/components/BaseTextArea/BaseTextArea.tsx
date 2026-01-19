import React from 'react';
import classNames from 'classnames';
import styles from './BaseTextArea.module.scss';
import type { TextareaHTMLAttributes } from 'react';

export type BaseTextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const BaseTextArea: React.FC<BaseTextAreaProps> = (props) => {
    const { className, ...rest } = props;

    const rootClassName = classNames(styles.BaseTextArea, className);

    return <textarea {...rest} className={rootClassName} />;
};

export default BaseTextArea;
