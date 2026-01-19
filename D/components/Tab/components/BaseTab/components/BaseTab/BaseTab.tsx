import React from 'react';
import classNames from 'classnames';
import styles from './BaseTab.module.scss';

import Select from '@/shared/headless/Select/Select';

export type BaseTabExtraProps = {
    className?: string;
};

export type BaseTabProps = React.ComponentProps<typeof Select> & BaseTabExtraProps;

const BaseTab: React.FC<BaseTabProps> = (props) => {
    const { className, children, ...selectProps } = props;

    const rootClassName = classNames(styles.BaseTab, className);

    return (
        <div className={rootClassName}>
            <Select {...selectProps}>{children}</Select>
        </div>
    );
};

export default BaseTab;
