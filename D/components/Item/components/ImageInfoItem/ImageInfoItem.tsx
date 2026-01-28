import React from 'react';
import styles from './ImageInfoItem.module.scss';
import Flex from '@/shared/primitives/Flex/Flex';
import { Common } from '@/shared/primitives/C/Common';
import { MdArrowForwardIos } from 'react-icons/md';

export type ImageInfoItemProps = {
    imageSrc: string;
    imageAlt?: string;
    imagePrefix?: string;
    title: string;
    count: number;
    description: string;
    onClick?: () => void;
    showArrow?: boolean;
};

const ImageInfoItem = ({
    imageSrc,
    imageAlt,
    imagePrefix,
    title,
    count,
    description,
    onClick,
    showArrow = true,
}: ImageInfoItemProps) => (
    <div className={styles.ImageInfoItem} onClick={onClick}>
        <div className={styles.Image}>
            <Common.Image
                src={imageSrc}
                prefix={imagePrefix}
                alt={imageAlt ?? `${title}-템플릿 이미지`}
                width="100%"
                height="100%"
                fit="cover"
                block
            />
        </div>
        <div className={styles.Info}>
            <div className={styles.Texts}>
                <Flex gap={8} align="center">
                    <span className={styles.Title}>{title}</span>
                    <span className={styles.Count}>({count})</span>
                </Flex>
                <span className={styles.Description}>{description}</span>
            </div>
            {showArrow ? <MdArrowForwardIos /> : null}
        </div>
    </div>
);

export default ImageInfoItem;
