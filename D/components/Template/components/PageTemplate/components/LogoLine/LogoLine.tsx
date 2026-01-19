import React from 'react';
import styles from './LogoLine.module.scss';
import Logo from '@/shared/assets/images/logo.svg';

export const LogoLine = () => (
    <div className={styles.LogoLine}>
        <img src={Logo} alt="로고" />
        <span>마케팅레버리지</span>
    </div>
);
