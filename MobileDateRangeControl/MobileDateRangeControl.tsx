import { memo } from 'react';
import Header from '../granter/components/CardsHeaderContent/CardsHeaderContent';
import styles from './MobileDateRangeControl.module.scss';

type MobileDateRangeControlProps = {
    from: string;
    to: string;
    onValueChange: (from?: string, to?: string) => void;
    allowFutureDates?: boolean;
};

export const MobileDateRangeControl = memo(({
    from,
    to,
    onValueChange,
    allowFutureDates = false,
}: MobileDateRangeControlProps) => (
    <div className={styles.Root}>
        <Header.DateRangeControl
            className={styles.Control}
            mode="date"
            dateLabel={`${from} ~ ${to}`}
            value={{ from, to }}
            allowFutureDates={allowFutureDates}
            onValueChange={(next) => onValueChange(next.from, next.to)}
        />
    </div>
));

MobileDateRangeControl.displayName = 'MobileDateRangeControl';
