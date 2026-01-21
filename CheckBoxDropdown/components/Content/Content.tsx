// CheckBoxDropdown/Content/Content.tsx
import React from 'react';
import classNames from 'classnames';

import styles from './Content.module.scss';
import Dropdown, { useDropdown } from '@/shared/headless/Dropdown/Dropdown';

type ContentProps = {
    children: React.ReactNode;
};

const Content = ({ children }: ContentProps) => {
    const { isOpen } = useDropdown();

    const combinedClassName = classNames(styles.Content, {
        [styles.Open]: isOpen,
        [styles.Closed]: !isOpen,
    });

    return (
        <Dropdown.Content className={combinedClassName} matchTriggerWidth>
            <div className={styles.Scroll}>{children}</div>
        </Dropdown.Content>
    );
};

export default Content;
