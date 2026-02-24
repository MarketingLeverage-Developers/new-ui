import React from 'react';
import styles from './LogoLine.module.scss';
import Logo from '../../../../../../../shared/assets/components/D/components/Template/components/PageTemplate/components/LogoLine/logo.svg';

const DEFAULT_LOGO_ALT = '로고';
const DEFAULT_LOGO_TEXT = '마케팅레버리지';

export type LogoLineProps = {
    imageSrc?: string;
    imageAlt?: string;
    text?: React.ReactNode;
};

export const LogoLine = ({ imageSrc = Logo, imageAlt = DEFAULT_LOGO_ALT, text = DEFAULT_LOGO_TEXT }: LogoLineProps) => (
    <div className={styles.LogoLine}>
        <img className={styles.Logo} src={imageSrc} alt={imageAlt} />
        <span className={styles.Text}>{text}</span>
    </div>
);
