import React from 'react';
import styles from './Line.module.scss';
import Flex from '@/shared/primitives/Flex/Flex';

type LineProps = {} & React.ComponentProps<typeof Flex>;

export const Line = ({ children, ...props }: LineProps) => (
    <Flex {...props} className={styles.Line}>
        {children}
    </Flex>
);
