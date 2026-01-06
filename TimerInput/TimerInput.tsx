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
    setIsAvailableCode?: React.Dispatch<React.SetStateAction<boolean>>;
} & ComponentProps<typeof RoundedInput>;

const clamp = (n: number, min = 0) => (n < min ? min : n);

const formatMMSS = (msLeft: number) => {
    const totalSec = Math.floor(clamp(msLeft) / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
};

const TimerInput = ({
    startTime,
    duration = 180,
    onExpire,
    confirmed,
    setIsAvailableCode,
    ...props
}: TimerInputProps) => {
    const now = Date.now();
    const start = startTime ?? now;
    const end = start + duration * 1000;

    const [msLeft, setMsLeft] = useState<number>(Math.max(end - now, 0));
    const expiredRef = useRef(false);
    const intervalRef = useRef<number | null>(null);

    const display = useMemo(() => formatMMSS(msLeft), [msLeft]);

    // startTime 기반 활성/비활성 제어
    useEffect(() => {
        // startTime이 없으면 비활성
        if (!startTime) {
            setIsAvailableCode?.(false);
            return;
        }

        // confirmed면 비활성 (이미 완료)
        if (confirmed) {
            setIsAvailableCode?.(false);
            return;
        }

        // startTime이 있고 confirmed가 아니면 기본 활성
        setIsAvailableCode?.(true);
    }, [startTime, confirmed, setIsAvailableCode]);

    // end/start가 바뀌면 리셋 + 활성화
    useEffect(() => {
        expiredRef.current = false;

        const left = Math.max(end - Date.now(), 0);
        setMsLeft(left);

        if (startTime && !confirmed) {
            setIsAvailableCode?.(left > 0);
        }
    }, [startTime, end, confirmed, setIsAvailableCode]);

    useEffect(() => {
        // 타이머 자체가 활성 조건이 아닐 경우 interval 생성 X
        if (!startTime || confirmed) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        const tick = () => {
            const left = end - Date.now();
            const next = left > 0 ? left : 0;

            setMsLeft(next);

            // ✅ 남은 시간 기준으로 isAvailableCode 업데이트
            setIsAvailableCode?.(next > 0);

            if (left <= 0 && !expiredRef.current) {
                expiredRef.current = true;
                setIsAvailableCode?.(false);
                onExpire?.();
            }
        };

        tick();
        intervalRef.current = window.setInterval(tick, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [end, onExpire, confirmed, startTime, setIsAvailableCode]);

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
