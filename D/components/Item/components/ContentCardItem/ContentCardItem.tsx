import type { MouseEvent } from 'react';

import Box from '../../../Box/Box';
import Button from '../../../Button/Button';
import Text from '../../../Text/Text';
import { getThemeColor } from '../../../../../shared/utils/css/getThemeColor';
import styles from './ContentCardItem.module.scss';

export type ContentCardItemProps = {
    title?: string;
    metaText?: string;
    onClick?: () => void;
    onDeleteClick?: () => void;
};

const ContentCardItem = ({ title = 'Untitled', metaText = '-', onClick, onDeleteClick }: ContentCardItemProps) => {
    const classNames = [styles.ContentCardItem];

    if (onClick) classNames.push(styles['ContentCardItem--clickable']);

    const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onDeleteClick?.();
    };

    return (
        <div className={classNames.join(' ')} onClick={onClick}>
            <Box align="center" justify="space-between" gap={20}>
                <Text
                    fontSize={17}
                    fontWeight={600}
                    textColor={getThemeColor('Black1')}
                    style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 2,
                        overflow: 'hidden',
                    }}
                >
                    {title}
                </Text>
                {onDeleteClick ? <Button variant="trash" onClick={handleDeleteClick} style={{ flexShrink: 0 }} /> : null}
            </Box>
            <Text fontSize={15} textColor={getThemeColor('Gray2')}>
                {metaText}
            </Text>
        </div>
    );
};

export default ContentCardItem;
