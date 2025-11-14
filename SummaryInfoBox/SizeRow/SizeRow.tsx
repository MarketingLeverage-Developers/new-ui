import React from 'react';
import styles from '../SummaryInfoBox.module.scss';
import icon from '@/shared/assets/images/size-icon.svg';
type Props = {
    sizes: string[];
};
const SizeRow = ({ sizes }: Props) => (
    <div className={styles.Row}>
        <img src={icon} alt="" />
        <div className={styles.SizeBoxes}>
            {sizes?.map((size) => (
                <div>{size}</div>
            ))}
        </div>
    </div>
);

export default SizeRow;
