import React from 'react';

import styles from './LogoMobile.module.scss';
import Logo from '@/shared/assets/images/logo.svg';
import { Image } from '../Image/Image';

const LogoMobile = () => (
    <div className={styles.LogoMobile}>
        <Image width={24} height={24} src={Logo} alt="로고" />
    </div>
);

export default LogoMobile;
