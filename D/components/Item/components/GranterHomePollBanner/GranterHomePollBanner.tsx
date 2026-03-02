import React from 'react';
import styles from './GranterHomePollBanner.module.scss';

export type GranterHomePollBannerProps = {
    text: React.ReactNode;
};

const GranterHomePollBanner = ({ text }: GranterHomePollBannerProps) => (
    <section className={styles.PollBanner}>
        <p>{text}</p>
    </section>
);

export default GranterHomePollBanner;
