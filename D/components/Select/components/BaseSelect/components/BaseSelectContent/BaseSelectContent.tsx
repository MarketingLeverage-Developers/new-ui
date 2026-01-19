import React from 'react';
import classNames from 'classnames';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import styles from './BaseSelectContent.module.scss';

export type BaseSelectContentProps = React.ComponentProps<typeof Dropdown.Content> & {
    className?: string;
};

const BaseSelectContent: React.FC<BaseSelectContentProps> = (props) => {
    const { className, children, ...rest } = props;

    const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.preventDefault();
    };

    return (
        <Dropdown.Content {...rest} className={classNames(styles.Content, className)} onMouseDown={handleMouseDown}>
            {children}
        </Dropdown.Content>
    );
};

export default BaseSelectContent;
