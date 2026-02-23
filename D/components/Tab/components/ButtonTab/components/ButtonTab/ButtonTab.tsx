import React from 'react';
import classNames from 'classnames';
import styles from './ButtonTab.module.scss';

import Select from '../../../../../../../shared/headless/Select/Select';
import type { CSSVariables } from '../../../../../../../shared/types/css/CSSVariables';
import ButtonTabItem, { type ButtonTabItemProps } from './components/ButtonTabItem/ButtonTabItem';

export type ButtonTabExtraProps = {
    className?: string;
    activeBg?: string;
    activeBorder?: string;
    activeTextColor?: string;
};

export type ButtonTabProps = React.ComponentProps<typeof Select> & ButtonTabExtraProps;

type ButtonTabCompound = React.FC<ButtonTabProps> & {
    Item: React.FC<ButtonTabItemProps>;
};

const ButtonTabRoot: React.FC<ButtonTabProps> = (props) => {
    const { className, activeBg, activeBorder, activeTextColor, children, ...selectProps } = props;

    const rootClassName = classNames(styles.ButtonTab, className);
    const cssVariables: CSSVariables = {
        '--active-bg': activeBg,
        '--active-border': activeBorder,
        '--active-text-color': activeTextColor,
    };

    return (
        <div className={rootClassName} style={cssVariables}>
            <Select {...selectProps}>{children}</Select>
        </div>
    );
};

const ButtonTab = Object.assign(ButtonTabRoot, {
    Item: ButtonTabItem,
}) as ButtonTabCompound;

export default ButtonTab;
