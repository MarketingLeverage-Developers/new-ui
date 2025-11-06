import React, { type ButtonHTMLAttributes } from 'react';
import styles from './ApproveButton.module.scss';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { CSSLength } from '@/shared/types';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import classNames from 'classnames';
import Flex from '../Flex/Flex';
import { Image } from '../Image/Image';
import Text from '../Text/Text';
import SignIcon from '@/shared/assets/images/sign.svg';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';

type ApproveButtonPros = {
    bgColor?: HexColor | ThemeColorVar;
    width?: CSSLength;
    height?: CSSLength;
    fontSize?: CSSLength;
    padding?: PaddingSize;
    textColor?: HexColor | ThemeColorVar;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const ApproveButton = ({
    width = 94,
    height = 48,
    fontSize = 15,
    textColor,
    padding = { x: 20, y: 12 },
    ...props
}: ApproveButtonPros) => {
    const cssVariables: CSSVariables = {
        '--font-size': toCssUnit(fontSize),
        '--padding': toCssPadding(padding),
        '--width': toCssUnit(width),
        '--height': toCssUnit(height),
        '--color': textColor,
    };

    const buttonClassName = classNames(styles.ApproveButton, {
        [styles.Disabled]: props.disabled,
    });

    return (
        <button className={buttonClassName} style={{ ...cssVariables, ...props.style }} {...props}>
            <Flex gap={4} align="center" justify="center" about="center">
                <Image src={SignIcon} alt="RejectButton" />

                <Text fontWeight={600} textColor={getThemeColor('White1')}>
                    승인
                </Text>
            </Flex>
        </button>
    );
};

export default ApproveButton;
