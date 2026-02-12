import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import Select from '@/shared/headless/Select/Select';
import React from 'react';
import styles from './Display.module.scss';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import classNames from 'classnames';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import type { CSSLength } from '@/shared/types/css/CSSLength';
import { toCssUnit } from '@/shared/utils/css/toCssUnit';

type DisplayProps = React.ComponentProps<typeof Select.Display> & {
    fullWidth?: boolean;
    padding?: PaddingSize | number;
    width?: CSSLength;
    height?: CSSLength;
};

export const Display = ({
    fullWidth = false,
    padding = { x: 16, y: 13 },
    width,
    height,
    ...props
}: DisplayProps) => {
    const cssVariables: CSSVariables = {
        '--padding': toCssPadding(padding),
        '--width': toCssUnit(width),
        '--height': toCssUnit(height),
    };
    const BorderRoundedSelectDisplayclassName = classNames(styles.Display, {
        [styles.FullWidth]: fullWidth,
    });

    return (
        <Dropdown.Trigger className={BorderRoundedSelectDisplayclassName} style={cssVariables}>
            <Select.Display {...props} className={styles.Content} />
            <MdOutlineKeyboardArrowDown className={styles.Arrow} />
        </Dropdown.Trigger>
    );
};
