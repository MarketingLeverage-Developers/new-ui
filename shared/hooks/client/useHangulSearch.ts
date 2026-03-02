import { useMemo } from 'react';
import { buildHangulIndex, disassembleHangul, choseongOnly, isConsonantOnly } from '../../utils/search/hangulSearch';

type HangulIndex = ReturnType<typeof buildHangulIndex>;
export type WithIndex<T> = T & { _idx: HangulIndex };

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const useHangulSearch = <T>(data: T[], query: string, getLabel: (item: T) => string) => {
    const collator = useMemo(() => new Intl.Collator(['ko', 'en'], { sensitivity: 'base' }), []);

    const indexed = useMemo<WithIndex<T>[]>(
        () =>
            data.map((it) => ({
                ...(it as T),
                _idx: buildHangulIndex(String(getLabel(it) ?? '')),
            })),
        [data, getLabel]
    );

    const filtered = useMemo<WithIndex<T>[]>(() => {
        const qRaw = (query ?? '').trim();
        if (!qRaw) return indexed;

        const q = qRaw.toLowerCase();
        const qJamo = disassembleHangul(q);
        const qCho = choseongOnly(q).replace(/\s+/g, '');
        const onlyConsonants = isConsonantOnly(q);

        type Row = WithIndex<T> & { _score: number };
        const rows: Row[] = [];

        for (const item of indexed) {
            const { _idx } = item;

            // 매칭 여부
            const normPos = _idx.norm.indexOf(q);
            const jamoPos = _idx.jamo.indexOf(qJamo);
            const choPos = _idx.cho.indexOf(qCho);

            const matches =
                _idx.norm === q || normPos >= 0 || (!onlyConsonants && jamoPos >= 0) || (onlyConsonants && choPos >= 0);

            if (!matches) continue;

            // 랭킹 점수
            let score = 0;

            // 1) 강한 매칭
            if (_idx.norm === q) score += 1000; // 완전일치
            if (onlyConsonants && choPos === 0) score += 850; // 초성 시작일치
            if (!onlyConsonants && jamoPos === 0) score += 800; // 자모 시작일치
            if (normPos === 0) score += 700; // 일반 시작일치

            // 2) 포함 위치(빠를수록 가산)
            if (normPos > 0) score += 300 - normPos;
            if (!onlyConsonants && jamoPos > 0) score += 200 - jamoPos;
            if (onlyConsonants && choPos > 0) score += 200 - choPos;

            // 3) 영문/숫자 단어경계 보너스 (예: "s"가 단어 시작이면 가산)
            try {
                const wb = _idx.norm.search(new RegExp(`\\b${escapeRegExp(q)}`));
                if (wb === 0) score += 120; // 단어 시작 경계
                else if (wb > 0) score += 60;
            } catch {
                /* 정규식 에러 방지 */
            }

            rows.push({ ...item, _score: score });
        }

        // 점수 → 라벨 정렬(동점일 때)
        rows.sort((a, b) => b._score - a._score || collator.compare(getLabel(a), getLabel(b)));

        return rows;
    }, [indexed, query, getLabel, collator]);

    return { indexed, filtered };
};
