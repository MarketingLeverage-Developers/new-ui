import React from 'react';
import styles from './ConsentGroup.module.scss';
import Item from './components/item';

type ConsentGroupProps = {
    allLabel: string;

    children: React.ReactNode;
};

const ConsentGroup = ({ allLabel, children }: ConsentGroupProps) => (
    <div className={styles.ConsentGroup}>{children}</div>
);

export default ConsentGroup;

ConsentGroup.Item = Item;
