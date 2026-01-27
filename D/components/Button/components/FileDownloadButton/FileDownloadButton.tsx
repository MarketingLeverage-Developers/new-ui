import React from 'react';
import Text from '../../../../Text/Text';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';

export type FileDownloadButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    text?: string;
};

const FileDownloadButton = React.forwardRef<HTMLButtonElement, FileDownloadButtonProps>(
    ({ onClick, text = '전체 다운로드', style, ...props }, ref) => (
        <button
            type="button"
            onClick={onClick}
            {...props}
            ref={ref}
            style={{ background: 'transparent', border: 'none', padding: 0, ...style }}
        >
            <Text
                textColor={getThemeColor('Gray2')}
                fontSize={15}
                fontWeight={500}
                style={{ textDecoration: 'underline', cursor: 'pointer' }}
            >
                {text}
            </Text>
        </button>
    )
);

FileDownloadButton.displayName = 'FileDownloadButton';

export default FileDownloadButton;
