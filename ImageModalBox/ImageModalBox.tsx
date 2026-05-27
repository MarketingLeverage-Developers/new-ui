import Modal from '../shared/headless/Modal/Modal';
import type { CSSLength } from '../shared/types';
import type { CSSVariables } from '../shared/types/css/CSSVariables';
import { toCssUnit } from '../shared/utils';
import React from 'react';
import Flex from '../Flex/Flex';
import styles from './ImageModalBox.module.scss';
import Portal from '../shared/headless/Portal/Portal';
import Text from '../Text/Text';
import { getThemeColor } from '../shared/utils/css/getThemeColor';

type Props = {
    width?: CSSLength;
    height?: CSSLength;
    image: string;
    showName?: boolean;
    name?: string;
};

const resolveImageUrl = (image: string) => {
    if (/^(?:https?:)?\/\//i.test(image) || image.startsWith('blob:') || image.startsWith('data:')) return image;

    const apiBaseUrl = import.meta.env.VITE_API_URL ?? '';
    const normalizedImage = image.startsWith('/api/') ? image.slice(4) : image;
    return `${apiBaseUrl}/api${normalizedImage}`;
};

const ImageModalBox = ({ width, height, image, showName = false, name }: Props) => {
    const cssVariables: CSSVariables = {
        '--width': toCssUnit(width),
        '--height': toCssUnit(height),
    };
    const imageUrl = image ? resolveImageUrl(image) : '';

    return (
        <Modal>
            <Modal.Trigger className={styles.ImageTrigger}>
                <Flex direction="column" gap={4}>
                    {imageUrl ? <img src={imageUrl} alt={name ?? 'image preview'} style={{ ...cssVariables }} /> : null}
                    {showName && (
                        <Text fontSize={13} textColor={getThemeColor('Gray2')} fontWeight={500}>
                            {name}
                        </Text>
                    )}
                </Flex>
            </Modal.Trigger>
            <Portal>
                <Modal.Backdrop className={styles.ImageModalBackdrop} />
                <Modal.Content className={styles.ImageModalContent}>
                    <img src={imageUrl} alt={name ?? 'image preview'} />
                </Modal.Content>
            </Portal>
        </Modal>
    );
};

export default ImageModalBox;
