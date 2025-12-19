import React, { useEffect, useMemo, useState } from 'react';
import Flex from '@/shared/primitives/Flex/Flex';
import RoundedInput from '@/shared/primitives/RoundedInput/RoundedInput';
import Text from '@/shared/primitives/Text/Text';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';

type PhoneNumberInqutProps = {
    value?: string; // "01012345678" 같은 합쳐진 값
    onChange: (value: string) => void;
    placeholderFirst?: string;
    placeholderMiddle?: string;
    placeholderLast?: string;
};

const onlyDigits = (v: string) => v.replace(/\D/g, '');

const splitPhone = (value?: string) => {
    const digits = onlyDigits(value ?? '');
    return [digits.slice(0, 3), digits.slice(3, 7), digits.slice(7, 11)] as const;
};

const PhoneNumberInqut = ({
    value,
    onChange,
    placeholderFirst = '010',
    placeholderMiddle = '0000',
    placeholderLast = '0000',
}: PhoneNumberInqutProps) => {
    const initial = useMemo(() => splitPhone(value), []); // 최초 1회
    const [first, setFirst] = useState(initial[0]);
    const [middle, setMiddle] = useState(initial[1]);
    const [last, setLast] = useState(initial[2]);

    // 내부 3칸 변경 -> 외부로 합친 값 전달
    useEffect(() => {
        const combined = `${onlyDigits(first)}${onlyDigits(middle)}${onlyDigits(last)}`;
        if (combined !== onlyDigits(value ?? '')) {
            onChange(combined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [first, middle, last]);

    // 외부 value 변경(리셋/초기값 세팅 등) -> 내부 3칸 동기화
    useEffect(() => {
        const [a, b, c] = splitPhone(value);
        if (a !== first) setFirst(a);
        if (b !== middle) setMiddle(b);
        if (c !== last) setLast(c);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <Flex gap={8} align="center">
            <RoundedInput
                type="tel"
                maxLength={3}
                placeholder={placeholderFirst}
                value={first}
                onChange={(e) => setFirst(onlyDigits(e.target.value).slice(0, 3))}
            />
            <Text textColor={getThemeColor('Gray3')}>-</Text>
            <RoundedInput
                type="tel"
                maxLength={4}
                placeholder={placeholderMiddle}
                value={middle}
                onChange={(e) => setMiddle(onlyDigits(e.target.value).slice(0, 4))}
            />
            <Text textColor={getThemeColor('Gray3')}>-</Text>
            <RoundedInput
                type="tel"
                maxLength={4}
                placeholder={placeholderLast}
                value={last}
                onChange={(e) => setLast(onlyDigits(e.target.value).slice(0, 4))}
            />
        </Flex>
    );
};

export default PhoneNumberInqut;
