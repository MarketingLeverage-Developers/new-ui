// ErrorFallback.tsx
import React from 'react';
import Flex from '../Flex/Flex';
import Text from '../Text/Text';
import BaseButton from '../BaseButton/BaseButton';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import ErrorImage from '@/shared/assets/images/error.svg';

interface ErrorFallbackProps {
    onRetry?: () => void;
    message?: string;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ onRetry, message }) => {
    const description = message && message.trim().length > 0 ? message : '잠시 후에 다시 시도해 주세요';

    return (
        <Flex direction="column" gap={16} align="center">
            <img src={ErrorImage} />
            <Text fontSize={17} fontWeight={500} textColor={getThemeColor('Gray1')}>
                오류가 발생했습니다
            </Text>
            <Text fontSize={15} fontWeight={400} textColor={getThemeColor('Gray2')}>
                {description}
            </Text>
            <BaseButton
                bgColor={getThemeColor('Primary1')}
                height={44}
                padding={{ x: 42, y: 12 }}
                radius={8}
                onClick={onRetry}
            >
                재시도
            </BaseButton>
        </Flex>
    );
};

export default ErrorFallback;
