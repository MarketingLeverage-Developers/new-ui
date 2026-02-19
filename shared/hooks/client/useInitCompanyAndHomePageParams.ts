// src/features/company/select/logic/useInitCompanyAndHomepageParams.ts
import { useEffect, useMemo } from 'react';
import useCompanyListFetchQuery from '@/hooks/common/useCompanyListFetchQuery';
import type { CompanyListItem } from '@/types/company/companyListTypes';

type UseInitCompanyAndHomepageParamsArgs = {
    companyUuid: string;
    homepageUuid?: string;

    updateParams: (values: { companyUuid?: string | null; homepageUuid?: string | null }) => void;

    /**
     * 이 페이지에서 homepageUuid를 URL params로 "관리(초기화/동기화)"할지 여부
     * - false: homepageUuid 관련 effect/로컬스토리지/파라미터 변경 전부 안 함
     * - true: 기존 동작 그대로
     */
    enableHomepage?: boolean;

    /**
     * 이 페이지에서 companyUuid를 URL params로 "관리(초기화/동기화)"할지 여부
     * (필요하면 쓰고, 기본은 true)
     */
    enableCompany?: boolean;

    /**
     * localStorage / URL을 무시하고
     * 항상 첫 회사 / 첫 홈페이지로 강제 보정 (ML 케이스용)
     */
    forceFirstSelection?: boolean;
};

const LAST_SELECTED_COMPANY_KEY = 'lastSelectedCompanyUuid';
const LAST_SELECTED_HOMEPAGE_KEY = 'lastSelectedHomepageUuid';

/**
 * companyUuid / homepageUuid를
 * - URL 파라미터
 * - localStorage
 * - 회사/홈페이지 리스트
 * 기준으로 초기화/동기화하는 훅
 */
export const useInitCompanyAndHomepageParams = ({
    companyUuid,
    homepageUuid,
    updateParams,
    enableHomepage = true,
    enableCompany = true,
    forceFirstSelection = false,
}: UseInitCompanyAndHomepageParamsArgs) => {
    const { res } = useCompanyListFetchQuery();
    const companyList: CompanyListItem[] = useMemo(() => res?.data?.body ?? [], [res?.data?.body]);

    /**
     * 1) companyUuid 초기화 (URL / localStorage / 리스트 기준)
     */
    useEffect(() => {
        if (!enableCompany) return;
        if (!companyList.length) return;

        // 강제 첫 회사로 리다이렉트
        if (forceFirstSelection) {
            const first = companyList[0]?.uuid;
            if (first && first !== companyUuid) {
                updateParams({ companyUuid: first });
            }
            return;
        }

        if (companyUuid && companyList.some((c) => c.uuid === companyUuid)) return;

        const saved = localStorage.getItem(LAST_SELECTED_COMPANY_KEY);
        const hasValidSaved = !!saved && companyList.some((c) => c.uuid === saved);

        const initial = (hasValidSaved ? saved! : companyList[0]?.uuid) ?? '';

        if (initial && initial !== companyUuid) {
            updateParams({ companyUuid: initial });
        }
    }, [enableCompany, companyList, companyUuid, forceFirstSelection, updateParams]);

    /**
     * 2) companyUuid 변경 시 localStorage 반영
     */
    useEffect(() => {
        if (!enableCompany) return;
        if (companyUuid) {
            localStorage.setItem(LAST_SELECTED_COMPANY_KEY, companyUuid);
        }
    }, [enableCompany, companyUuid]);

    // companyUuid가 유효하지 않거나 companyList가 없을 때는 homepage 계산도 의미 없어서 방어
    const selectedCompany = useMemo(() => companyList.find((c) => c.uuid === companyUuid), [companyList, companyUuid]);
    const homepageList = selectedCompany?.homepages ?? [];

    /**
     * 3) homepageUuid 초기화 (선택된 회사의 홈페이지만 기준)
     *    - enableHomepage=false면 아예 동작하지 않음 (이 페이지에서 홈피 안 쓰는 케이스)
     */
    useEffect(() => {
        if (!enableHomepage) return;

        // 홈페이가 아예 없으면 homepageUuid 비우기
        if (!homepageList.length) {
            if (homepageUuid) {
                updateParams({ homepageUuid: null });
            }
            return;
        }

        // 무조건 첫 홈페이지로 리다이렉트
        if (forceFirstSelection) {
            const firstHomepageUuid = homepageList[0]?.uuid;
            if (firstHomepageUuid && firstHomepageUuid !== homepageUuid) {
                updateParams({ homepageUuid: firstHomepageUuid });
            }
            return;
        }

        // 현재 homepageUuid가 여전히 유효하면 그대로 둠
        if (homepageUuid && homepageList.some((h) => h.uuid === homepageUuid)) {
            return;
        }

        // localStorage에서 마지막 선택 홈피 찾기
        const saved = localStorage.getItem(LAST_SELECTED_HOMEPAGE_KEY);
        const hasValidSaved = !!saved && homepageList.some((h) => h.uuid === saved);

        const initial = (hasValidSaved ? saved! : homepageList[0]?.uuid) ?? '';

        if (initial && initial !== homepageUuid) {
            updateParams({ homepageUuid: initial });
        }
    }, [enableHomepage, homepageList, homepageUuid, updateParams, forceFirstSelection]);

    /**
     * 4) homepageUuid 변경 시 localStorage 반영
     */
    useEffect(() => {
        if (!enableHomepage) return;
        if (homepageUuid) {
            localStorage.setItem(LAST_SELECTED_HOMEPAGE_KEY, homepageUuid);
        }
    }, [enableHomepage, homepageUuid]);
};
