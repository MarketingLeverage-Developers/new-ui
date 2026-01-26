import React, { type ReactNode } from 'react';

export type BaseAlterFileUploaderExtraProps = {
    className?: string;
};

type Props = BaseAlterFileUploaderExtraProps & {
    children: ReactNode;
};

const BaseAlterFileUploader: React.FC<Props> = (props) => {
    const { children, className } = props;
    return (
        <div className={className} style={{ width: '100%', height: '100%' }}>
            {children}
        </div>
    );
};

export default BaseAlterFileUploader;
