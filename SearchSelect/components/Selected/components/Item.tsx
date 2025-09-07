import React from 'react';
import { MdCancel } from 'react-icons/md';
import styles from '../Selected.module.scss';

type ItemProps = {
    text: string;
    onCancel: () => void;
};

const Item = ({ text, onCancel }: ItemProps) => (
    <div className={styles.Item}>
        <span>{text}</span>
        <MdCancel style={{ cursor: 'pointer' }} onClick={onCancel} />
    </div>
);

export default Item;
