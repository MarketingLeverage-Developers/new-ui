import React from 'react';
import styles from '../SummaryInfoBox.module.scss';
type Props = {
    links: string[];
};
const LinksRow = ({ links }: Props) => (
    <div className={styles.Row}>
        {links.map((link) => (
            <a href={link} target="_blank" rel="noopener noreferrer" className={styles.LinkText}>
                {link}
            </a>
        ))}
    </div>
);

export default LinksRow;
