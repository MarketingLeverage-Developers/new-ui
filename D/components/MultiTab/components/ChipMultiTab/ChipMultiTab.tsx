import React from 'react';
import classNames from 'classnames';
import styles from './ChipMultiTab.module.scss';

import ManySelect from '@/shared/headless/ManySelect/ManySelect';
import ChipMultiTabItem, { type ChipMultiTabItemProps } from './components/ChipMultiTabItem/ChipMultiTabItem';

export type ChipMultiTabExtraProps = {
    className?: string;
};

export type ChipMultiTabProps = React.ComponentProps<typeof ManySelect> & ChipMultiTabExtraProps;

type ChipMultiTabCompound = React.FC<ChipMultiTabProps> & {
    Item: React.FC<ChipMultiTabItemProps>;
};

const ChipMultiTabRoot: React.FC<ChipMultiTabProps> = (props) => {
    const { className, children, ...rest } = props;

    const rootClassName = classNames(styles.ChipMultiTab, className);

    return (
        <div className={rootClassName}>
            <ManySelect {...rest}>{children}</ManySelect>
        </div>
    );
};

const ChipMultiTab = Object.assign(ChipMultiTabRoot, {
    Item: ChipMultiTabItem,
}) as ChipMultiTabCompound;

export default ChipMultiTab;
