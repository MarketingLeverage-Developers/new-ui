import React, { useMemo } from 'react';
import classNames from 'classnames';
import Dropdown from '../../../shared/headless/Dropdown/Dropdown';
import Select, { useSelect } from '../../../shared/headless/Select/Select';
import { useQuerySearch } from '../../../shared/headless/QuerySearch/QuerySearch';
import { MdOutlineKeyboardArrowDown } from 'react-icons/md';
import type { PaddingSize } from '../../../shared/types/css/PaddingSize';
import type { CSSVariables } from '../../../shared/types/css/CSSVariables';
import type { CSSLength } from '../../../shared/types/css/CSSLength';
import { toCssPadding } from '../../../shared/utils/css/toCssPadding';
import { toCssUnit } from '../../../shared/utils/css/toCssUnit';
import type { SearchableBorderRoundedSelectItem } from '../types';
import styles from './Display.module.scss';

type DisplayProps = Omit<React.ComponentProps<typeof Select.Display>, 'render'> & {
    placeholder?: string;
    fullWidth?: boolean;
    padding?: PaddingSize | number;
    width?: CSSLength;
    height?: CSSLength;
    render?: (value: string, defaultLabel: string) => React.ReactNode;
};

export const Display = ({
    placeholder = '선택',
    fullWidth = false,
    padding = { x: 16, y: 13 },
    width,
    height,
    className,
    render,
    ...props
}: DisplayProps) => {
    const { selectValue } = useSelect();
    const { data } = useQuerySearch<SearchableBorderRoundedSelectItem>();

    const selectedLabel = useMemo(
        () => data.find((item) => item.uuid === selectValue)?.label ?? placeholder,
        [data, placeholder, selectValue]
    );

    const cssVariables: CSSVariables = {
        '--padding': toCssPadding(padding),
        '--width': toCssUnit(width),
        '--height': toCssUnit(height),
    };

    return (
        <Dropdown.Trigger className={classNames(styles.Display, { [styles.FullWidth]: fullWidth })} style={cssVariables}>
            <Select.Display
                {...props}
                className={classNames(styles.Content, className)}
                render={(value) => (render ? render(value, selectedLabel) : selectedLabel)}
            />
            <MdOutlineKeyboardArrowDown className={styles.Arrow} />
        </Dropdown.Trigger>
    );
};
