import Dropdown from '../../../../../../../shared/headless/Dropdown/Dropdown';
import React from 'react';
import styles from './Content.module.scss';

type ContentProps = React.ComponentProps<typeof Dropdown.Content>;

const Content = ({ keepMounted = false, className, ...props }: ContentProps) => (
    <Dropdown.Content
        {...props}
        keepMounted={keepMounted}
        className={[styles.Content, className].filter(Boolean).join(' ')}
    />
);

export type BareSelectContentProps = ContentProps;
export default Content;
