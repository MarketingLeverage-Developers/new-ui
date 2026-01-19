import React, { type ReactNode } from 'react';

export type BaseAlterFileUploaderExtraProps = {
    className?: string;
};

type Props = BaseAlterFileUploaderExtraProps & {
    children: ReactNode;
};

const BaseAlterFileUploader: React.FC<Props> = (props) => {
    const { children, className } = props;
    return <div className={className}>{children}</div>;
};

export default BaseAlterFileUploader;
