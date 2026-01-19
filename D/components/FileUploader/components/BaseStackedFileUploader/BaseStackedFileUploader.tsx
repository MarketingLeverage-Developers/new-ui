import React, { type ReactNode } from 'react';

export type BaseStackedFileUploaderExtraProps = {
    className?: string;
};

type Props = BaseStackedFileUploaderExtraProps & {
    children: ReactNode;
};

const BaseStackedFileUploader: React.FC<Props> = (props) => {
    const { children, className } = props;
    return <div className={className}>{children}</div>;
};

export default BaseStackedFileUploader;
