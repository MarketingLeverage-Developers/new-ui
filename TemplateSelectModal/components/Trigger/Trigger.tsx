import React from 'react';
import styles from './Trigger.module.scss';
import { IoIosCloseCircle } from 'react-icons/io';
import Text from '@/shared/primitives/Text/Text';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import Flex from '@/shared/primitives/Flex/Flex';
import { FaAngleRight } from 'react-icons/fa';
import Modal from '@/shared/headless/Modal/Modal';
import { Image } from '@/shared/primitives/Image/Image';

export const Trigger = ({
    imageUrl,
    onDeleteClick,
    templateImageUUID,
}: {
    imageUrl: string;
    templateImageUUID: string;
    onDeleteClick?: () => void;
}) => (
    <Modal.Trigger>
        <div className={styles.ImageBox}>
            {templateImageUUID ? (
                <>
                    <Image width={'100%'} height={'100%'} src={imageUrl ?? ''} alt={'trigger'} />
                    <IoIosCloseCircle
                        color="#fff"
                        size={20}
                        className={styles.Icon}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onDeleteClick) onDeleteClick();
                        }}
                    />
                </>
            ) : (
                <Flex gap={10} align="center">
                    <Text fontSize={24} fontWeight={600} textColor={getThemeColor('Primary1')}>
                        템플릿 선택하기
                    </Text>
                    <div className={styles.Arrow}>
                        <FaAngleRight />
                    </div>
                </Flex>
            )}
        </div>
    </Modal.Trigger>
);
