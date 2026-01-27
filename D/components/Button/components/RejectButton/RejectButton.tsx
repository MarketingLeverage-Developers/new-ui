import React, { type ButtonHTMLAttributes } from 'react';
import styles from './RejectButton.module.scss';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import classNames from 'classnames';
import { toCssUnit } from '@/shared/utils';
import type { CSSLength } from '@/shared/types';
import { Image } from '../../../../../Image/Image';
import Flex from '../../../../../Flex/Flex';
import removeIcon from '@/shared/assets/images/removebg-preview.svg';
import Text from '../../../../../Text/Text';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';

export type RejectButtonProps = {
    bgColor?: HexColor | ThemeColorVar;
    width?: CSSLength;
    height?: CSSLength;
    fontSize?: CSSLength;
    padding?: PaddingSize;
    textColor?: HexColor | ThemeColorVar;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const RejectButton = React.forwardRef<HTMLButtonElement, RejectButtonProps>(({
    bgColor = 'var(--White1)',
    width = 94,
    height = 48,
    fontSize = 15,
    textColor,
    padding = { x: 20, y: 12 },
    className,
    ...props
}, ref) => {
    const cssVariables: CSSVariables = {
        '--font-size': toCssUnit(fontSize),
        '--padding': toCssPadding(padding),
        '--width': toCssUnit(width),
        '--height': toCssUnit(height),
        '--color': textColor,
        '--background-color': bgColor,
    };

    const buttonClassName = classNames(styles.RejectButton, { [styles.Disabled]: props.disabled }, className);

    return (
        <button ref={ref} className={buttonClassName} style={{ ...cssVariables, ...props.style }} {...props}>
            <Flex gap={4} align="center" justify="center">
                <Flex padding={5}>
                    <Image src={removeIcon} alt="RejectButton" />
                </Flex>
                <Text fontWeight={600}>반려</Text>
            </Flex>
        </button>
    );
});

RejectButton.displayName = 'RejectButton';

export default RejectButton;
