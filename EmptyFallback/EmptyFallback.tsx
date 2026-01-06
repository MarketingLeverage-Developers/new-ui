import React from 'react';
import Flex from '../Flex/Flex';
import Text from '../Text/Text';
import { Image } from '../Image/Image';
import NoDataIcon from '@/shared/assets/images/no-data.png';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';

const EmptyFallback = () => (
    <Flex direction="column" align="center" gap={7}>
        <Image src={NoDataIcon} width={75} alt="데이터 없음 아이콘" />
        <Text fontSize={15} textColor={getThemeColor('Gray2')}>
            {'데이터가 없습니다.'}
        </Text>
    </Flex>
);

export default EmptyFallback;
