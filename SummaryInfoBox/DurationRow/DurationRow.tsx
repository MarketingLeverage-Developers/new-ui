import React from 'react';
import moment from 'moment';
import 'moment/dist/locale/ko';
moment.locale('ko');
type Props = {
    start: string;
    end: string;
};
const DurationRow = ({ start, end }: Props) => (
    <div>
        {start} - {end}
    </div>
);

export default DurationRow;
