import React, { useEffect, useMemo, useRef, useState, type ComponentProps } from 'react';
import styles from './TimerInput.module.scss';
import RoundedInput from '../RoundedInput/RoundedInput';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import { IoMdCheckmarkCircle } from 'react-icons/io';

type TimerInputProps = {
    startTime?: number;
    duration?: number;
    onExpire?: () => void;
    confirmed?: boolean;
} & ComponentProps<typeof RoundedInput>;

const clamp = (n: number, min = 0) => (n < min ? min : n);

const formatMMSS = (msLeft: number) => {
    const totalSec = Math.floor(clamp(msLeft) / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

const TimerInput = ({ startTime, duration = 180, onExpire, confirmed, ...props }: TimerInputProps) => {
    const now = Date.now();
    const start = startTime ?? now;
    const end = start + duration * 1000;
    const [msLeft, setMsLeft] = useState<number>(Math.max(end - now, 0));
    const expiredRef = useRef(false);
    const rafRef = useRef<number | null>(null);
    const intervalRef = useRef<number | null>(null);

    // 표시 문자열
    const display = useMemo(() => formatMMSS(msLeft), [msLeft]);

    // end/start가 바뀌면 즉시 리셋
    useEffect(() => {
        expiredRef.current = false;
        setMsLeft(Math.max(end - Date.now(), 0));
    }, [start, end]);

    // 1초 간격으로 now 기반 계산(드리프트 방지)
    useEffect(() => {
        if (confirmed) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return; // 확인되면 새로 만들지 않음
        }

        const tick = () => {
            const left = end - Date.now();
            setMsLeft(left > 0 ? left : 0);
            if (left <= 0 && !expiredRef.current) {
                expiredRef.current = true;
                onExpire?.();
            }
        };
        tick();
        intervalRef.current = window.setInterval(tick, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [end, onExpire, confirmed]);

    return (
        <div className={styles.TimerInput} style={{ ...props.style }}>
            <RoundedInput
                {...props}
                wrapperStyle={{ backgroundColor: getThemeColor('White1') }}
                placeholder={props.placeholder}
            />
            {startTime && (
                <span
                    className={styles.Timer}
                    aria-live="polite"
                    aria-label={confirmed ? '인증 완료' : `남은 시간 ${display}`}
                >
                    {confirmed ? <IoMdCheckmarkCircle color={getThemeColor('Green1')} size={16} /> : display}
                </span>
            )}
        </div>
    );
};

export default TimerInput;
