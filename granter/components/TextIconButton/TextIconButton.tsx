import React from 'react';
import classNames from 'classnames';
import PlainButton from '../Button/PlainButton';
import Text from '../Text/Text';
import styles from './TextIconButton.module.scss';

export type TextIconButtonVariant = 'page' | 'hero';

export type TextIconButtonProps = {
    children: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
    variant?: TextIconButtonVariant;
};

const rootClassName: Record<TextIconButtonVariant, string> = {
    page: styles.Page,
    hero: styles.Hero,
};

const textClassName: Record<TextIconButtonVariant, string> = {
    page: styles.PageText,
    hero: styles.HeroText,
};

const TextIconButton = ({ children, icon, onClick, variant = 'page' }: TextIconButtonProps) => (
    <PlainButton className={classNames(rootClassName[variant])} onClick={onClick}>
        <Text as="h2" className={textClassName[variant]}>
            {children}
        </Text>
        {icon}
    </PlainButton>
);

export default TextIconButton;
