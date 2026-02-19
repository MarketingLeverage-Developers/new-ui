// 역할: 서버는 validation만 보내고, 검증은 프론트 레지스트리가 전부 책임

import { z } from 'zod';
import type { ValidationType } from './types';

type BuildCtx = { label: string; required: boolean };
type Validator = (ctx: BuildCtx) => z.ZodTypeAny;

const imageArray = z.array(z.unknown());

// validation 종류별 정책을 미리 정의
export const VALIDATION_BY_KIND: Record<ValidationType, Validator> = {
    STRING: ({ label, required }) => {
        const s = z.string();
        return required ? s.min(1, `${label}을(를) 입력해주세요.`) : s.optional().default('');
    },
    IMAGE_ARRAY: ({ label, required }) => {
        const s = imageArray;
        return required ? s.min(1, `${label}을(를) 업로드해주세요.`) : s.optional().default([]);
    },
};
