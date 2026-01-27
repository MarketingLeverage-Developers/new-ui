import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import React from 'react';
import styles from './Content.module.scss';

type ContentProps = React.ComponentProps<typeof Dropdown.Content>;

const RoundedSelectContent: React.FC<ContentProps> = ({ ...props }) => (
    <Dropdown.Content {...props} className={styles.Content} />
);

export type { ContentProps as RoundedSelectContentProps };
export default RoundedSelectContent;
