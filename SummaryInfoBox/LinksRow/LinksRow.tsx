import React from 'react';
import styles from '../SummaryInfoBox.module.scss';
import icon from '@/shared/assets/images/reference-link-icon.svg';
type Props = {
    links: string[];
};
const LinksRow = ({ links }: Props) => (
    <div className={styles.Row}>
        <img src={icon} alt="" className={styles.DescriptionIcon} />
        <div className={styles.LinkContent}>
            {links.map((link) => (
                <a href={link} target="_blank" rel="noopener noreferrer" className={styles.LinkText}>
                    {link}
                </a>
            ))}
        </div>
    </div>
);

export default LinksRow;
