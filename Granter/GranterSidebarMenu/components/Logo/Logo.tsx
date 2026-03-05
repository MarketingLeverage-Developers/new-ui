import React from 'react';
import styles from '../../GranterSidebarMenu.module.scss';

export type GranterSidebarMenuLogoProps = {
    text: React.ReactNode;
    subText?: React.ReactNode;
    trailing?: React.ReactNode;
};

const Logo = ({ text, subText, trailing }: GranterSidebarMenuLogoProps) => (
    <div className={styles.Logo}>
        <div className={styles.LogoTextGroup}>
            <strong>{text}</strong>
            {subText ? <span>{subText}</span> : null}
        </div>
        {trailing ? <div className={styles.HeaderTrailing}>{trailing}</div> : null}
    </div>
);

export default Logo;
