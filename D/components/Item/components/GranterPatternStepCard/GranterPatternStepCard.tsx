import React from 'react';
import classNames from 'classnames';
import styles from './GranterPatternStepCard.module.scss';

export type GranterPatternStepCardProps = {
    title: React.ReactNode;
    actionSlot?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
};

const GranterPatternStepCard = ({ title, actionSlot, children, className }: GranterPatternStepCardProps) => (
    <section className={classNames(styles.Card, className)}>
        <header className={styles.Head}>
            <h3 className={styles.Title}>{title}</h3>
            {actionSlot ? <div className={styles.Action}>{actionSlot}</div> : null}
        </header>
        <div className={styles.Body}>{children}</div>
    </section>
);

export default GranterPatternStepCard;
