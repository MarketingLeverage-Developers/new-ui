import Dropdown from '../../../../../../../shared/headless/Dropdown/Dropdown';
import Select from '../../../../../../../shared/headless/Select/Select';
import React from 'react';
import styles from './Display.module.scss';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import type { CSSLength } from '../../../../../../../shared/types';
import type { CSSVariables } from '../../../../../../../shared/types/css/CSSVariables';
import { toCssUnit } from '../../../../../../../shared/utils';

type DisplayProps = React.ComponentProps<typeof Select.Display> & {
    width?: CSSLength;
};

const BorderRoundedSelectDisplay: React.FC<DisplayProps> = ({ width, ...props }) => {
    const cssVariables: CSSVariables = {
        '--display-width': toCssUnit(width),
    };

    return (
        <Dropdown.Trigger className={styles.Display} style={cssVariables}>
            <Select.Display {...props} className={styles.Content} />
            <MdOutlineKeyboardArrowDown className={styles.Arrow} />
        </Dropdown.Trigger>
    );
};

export type { DisplayProps as BorderRoundedSelectDisplayProps };
export default BorderRoundedSelectDisplay;
