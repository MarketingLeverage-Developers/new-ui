import React from 'react';
import styles from './LogoLine.module.scss';
import Logo from '@/shared/assets/images/logo.svg';

export const LogoLine = () => (
    <div className={styles.LogoLine}>
        <img className={styles.Logo} src={Logo} alt="로고" />
        <span className={styles.Text}>마레인트라넷</span>
    </div>
);
