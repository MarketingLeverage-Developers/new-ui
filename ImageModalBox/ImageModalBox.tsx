import Modal from '@/shared/headless/Modal/Modal';
import type { CSSLength } from '@/shared/types';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import React from 'react';
import Flex from '../Flex/Flex';
import styles from './ImageModalBox.module.scss';
import Portal from '@/shared/headless/Portal/Portal';
import Text from '../Text/Text';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';

type Props = {
    width?: CSSLength;
    height?: CSSLength;
    image: string;
    showName?: boolean;
    name?: string;
};
const ImageModalBox = ({ width, height, image, showName = false, name }: Props) => {
    const cssVariables: CSSVariables = {
        '--width': toCssUnit(width),
        '--height': toCssUnit(height),
    };
    return (
        <Modal>
            <Modal.Trigger className={styles.ImageTrigger}>
                <Flex direction="column" gap={4}>
                    {image ? (
                        <img src={`${import.meta.env.VITE_API_URL}/api${image}`} style={{ ...cssVariables }} />
                    ) : null}
                    {showName && (
                        <Text fontSize={13} color={getThemeColor('Gray2')} fontWeight={500}>
                            {name}
                        </Text>
                    )}
                </Flex>
            </Modal.Trigger>
            <Portal>
                <Modal.Backdrop className={styles.ImageModalBackdrop} />
                <Modal.Content className={styles.ImageModalContent}>
                    <img src={`${import.meta.env.VITE_API_URL}/api${image}`} />
                </Modal.Content>
            </Portal>
        </Modal>
    );
};

export default ImageModalBox;
