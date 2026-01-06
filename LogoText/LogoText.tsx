import React from 'react';
import styles from './LogoText.module.scss';
import Logo from '@/shared/assets/images/logo.svg';

const LogoText = () => (
    <div className={styles.LogoText}>
        <img src={Logo} alt="로고" />
        <span>마케팅레버리지</span>
    </div>
);

export default LogoText;
