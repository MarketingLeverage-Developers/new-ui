import React from 'react';
import styles from './PageName.module.scss';
import Flex from '../Flex/Flex';
import BaseChip from '../BaseChip/BaseChip';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';

type PageNameProps = {
    text: string;
    sample?: boolean;
};

const PageNameMobile = ({ text, sample }: PageNameProps) => (
    <Flex gap={16} align="center">
        <h1 className={styles.PageName}>{text}</h1>
        {sample && (
            <BaseChip
                bgColor={getThemeColor('Red2')}
                textColor={getThemeColor('Red1')}
                padding={{ y: 7, x: 12 }}
                radius={20}
                fontSize={13}
                fontWeight={500}
            >
                샘플페이지
            </BaseChip>
        )}
    </Flex>
);

export default PageNameMobile;
