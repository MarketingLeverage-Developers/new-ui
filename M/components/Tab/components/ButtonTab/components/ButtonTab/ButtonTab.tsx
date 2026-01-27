import React from 'react';
import classNames from 'classnames';
import styles from './ButtonTab.module.scss';
import Select from '@/shared/headless/Select/Select';
import ButtonTabItem, { type ButtonTabItemProps } from './components/ButtonTabItem/ButtonTabItem';

export type ButtonTabExtraProps = {
    className?: string;
};

export type ButtonTabProps = React.ComponentProps<typeof Select> & ButtonTabExtraProps;

type ButtonTabCompound = React.FC<ButtonTabProps> & {
    Item: React.FC<ButtonTabItemProps>;
};

const ButtonTabRoot: React.FC<ButtonTabProps> = (props) => {
    const { className, children, ...selectProps } = props;

    const rootClassName = classNames(styles.ButtonTab, className);

    return (
        <div className={rootClassName}>
            <Select {...selectProps}>{children}</Select>
        </div>
    );
};

const ButtonTab = Object.assign(ButtonTabRoot, {
    Item: ButtonTabItem,
}) as ButtonTabCompound;

export default ButtonTab;
