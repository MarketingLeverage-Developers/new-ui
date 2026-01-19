import React, { type ReactNode } from 'react';

export type BaseFileUploaderExtraProps = {
    className?: string;
};

type Props = BaseFileUploaderExtraProps & {
    children: ReactNode;
};

const BaseFileUploader: React.FC<Props> = (props) => {
    const { children, className } = props;
    return (
        <div className={className} style={{ width: '100%' }}>
            {children}
        </div>
    );
};

export default BaseFileUploader;
