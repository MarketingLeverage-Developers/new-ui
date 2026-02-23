import React, { type ReactNode } from 'react';
import classNames from 'classnames';
import styles from './BaseOutlineFileUploader.module.scss';

export type BaseOutlineFileUploaderExtraProps = {
    className?: string;
    stackedListView?: 'single' | 'grid';
};

type Props = BaseOutlineFileUploaderExtraProps & {
    children: ReactNode;
};

const BaseOutlineFileUploader: React.FC<Props> = ({ children, className }) => {
    const rootClassName = classNames(styles.BaseOutlineFileUploader, className);
    return <div className={rootClassName}>{children}</div>;
};

export default BaseOutlineFileUploader;
