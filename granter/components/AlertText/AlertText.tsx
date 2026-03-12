import React from 'react';
import Text, { type TextProps } from '../Text/Text';
import styles from './AlertText.module.scss';

export type AlertTextProps = Omit<TextProps, 'className' | 'children'> & {
    children: React.ReactNode;
};

const AlertText = ({ children, as = 'p', tone = 'danger', weight = 'medium', ...props }: AlertTextProps) => (
    <Text as={as} tone={tone} weight={weight} className={styles.Alert} {...props}>
        {children}
    </Text>
);

export default AlertText;
