import React from 'react';
import styles from '../SummaryInfoBox.module.scss';
import { IoExpandOutline } from 'react-icons/io5';
type Props = {
    sizes: string[];
};
const SizeRow = ({ sizes }: Props) => (
    <div className={styles.Row}>
        <IoExpandOutline className={styles.Icon} />
        <div className={styles.SizeBoxes}>
            {sizes?.map((size) => (
                <div>{size}</div>
            ))}
        </div>
    </div>
);

export default SizeRow;
