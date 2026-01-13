import React from 'react';
import Text from '../Text/Text';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';

type Props = {
    onClick?: () => void;
    text?: string;
};

const FileDownloadButton = ({ onClick, text = '전체 다운로드' }: Props) => (
    <Text
        textColor={getThemeColor('Gray2')}
        fontSize={15}
        fontWeight={500}
        style={{ textDecoration: 'underline', cursor: 'pointer' }}
        onClick={() => onClick && onClick()}
    >
        {text}
    </Text>
);

export default FileDownloadButton;
