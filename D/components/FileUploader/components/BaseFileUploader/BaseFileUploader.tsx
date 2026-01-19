import React, { type ReactNode } from 'react';
import styles from './BaseFileUploader.module.scss';
import classNames from 'classnames';

export type BaseFileUploaderExtraProps = {
    className?: string;
};

type Props = BaseFileUploaderExtraProps & {
    children: ReactNode;
};

const BaseFileUploader: React.FC<Props> = (props) => {
    const { children, className } = props;

    const baseFileUploaderClassName = classNames(styles.BaseFileUploader, className);

    return <div className={baseFileUploaderClassName}>{children}</div>;
};

export default BaseFileUploader;
