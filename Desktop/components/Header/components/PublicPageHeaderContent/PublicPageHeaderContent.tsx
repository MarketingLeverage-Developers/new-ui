import React from 'react';
import styles from './PublicPageHeaderContent.module.scss';
import LogoLandscapeText from '@/shared/primitives/LogoLandscapeText/LogoLandscapeText';

const PublicPageHeaderContent = () => (
    <div className={styles.PublicPageHeaderContent}>
        <LogoLandscapeText />
    </div>
);

export default PublicPageHeaderContent;
