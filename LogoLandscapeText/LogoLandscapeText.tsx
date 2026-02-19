import React from 'react';
import styles from './LogoLandscapeText.module.scss';
import Logo from './assets/logo-landscape.svg';

const LogoLandscapeText = () => (
    <div className={styles.LogoLandscapeText}>
        <img src={Logo} alt="로고" />
    </div>
);

export default LogoLandscapeText;
