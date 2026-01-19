import React from 'react';
import classNames from 'classnames';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import styles from './ChipMultiSelectContent.module.scss';

export type ChipMultiSelectContentProps = React.ComponentProps<typeof Dropdown.Content> & {
    className?: string;
};

const ChipMultiSelectContent: React.FC<ChipMultiSelectContentProps> = (props) => {
    const { className, children, ...rest } = props;

    const contentClassName = classNames(styles.Content, className);

    const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
        // ✅ blur로 닫히는 Dropdown이면 이 한 줄로 “선택해도 안 닫힘”
        e.preventDefault();
    };

    return (
        <Dropdown.Content {...rest} className={contentClassName} onMouseDown={handleMouseDown}>
            {children}
        </Dropdown.Content>
    );
};

export default ChipMultiSelectContent;
