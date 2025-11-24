import React from 'react';
import styles from '../RequestItemBox.module.scss';

const Header = ({ icon, title = '소재 요청' }: { icon: string; title?: string }) => (
    <div className={styles.Header}>
        <img src={icon} alt="" />
        <span>{title}</span>
    </div>
);

export default Header;
