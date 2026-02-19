import { useCallback, useMemo, useState } from 'react';
import { useListTableHeightFitMain } from '@/shared/hooks/client/useListTableHeightFitMain';

export type ListTableLayoutFitMainState = {
    /**
     * ListTable 고정 높이(px). 내부 스크롤 + sticky header를 위해 필요.
     */
    listTableHeight: number;
    /**
     * ListTable 내부 스크롤 엘리먼트. (ListInfiniteScroll 등 scroll 이벤트 기반 트리거에 사용)
     */
    listTableScrollEl: HTMLDivElement | null;
};

export type ListTableLayoutFitMainActions<TAnchorEl extends HTMLElement = HTMLDivElement> = {
    /**
     * "Main 높이 fit" 계산을 위한 anchor element ref 콜백.
     * PageTemplate의 main 영역 내부, overflow-y가 걸린 스크롤 컨테이너(Desktop.Main/Mobile.Main) 안쪽의
     * '안전한 엘리먼트'에 `ref={...}`로 꽂아준다.
     */
    setAnchorEl: (el: TAnchorEl | null) => void;
    /**
     * ListTable 내부 스크롤 엘리먼트를 전달받는 콜백.
     * Desktop.ListTable에 `onScrollElReady={...}`로 연결한다.
     */
    setListTableScrollEl: (el: HTMLDivElement | null) => void;
};

type Params = {
    minHeight?: number;
    compensationPx?: number;
};

export const useListTableLayoutFitMain = <TAnchorEl extends HTMLElement = HTMLDivElement>({
    minHeight = 360,
    compensationPx = -100,
}: Params = {}) => {
    const { ref: setAnchorEl, height: listTableHeight } = useListTableHeightFitMain<TAnchorEl>({
        minHeight,
        compensationPx,
    });

    const [listTableScrollEl, setListTableScrollElState] = useState<HTMLDivElement | null>(null);
    const setListTableScrollEl = useCallback((el: HTMLDivElement | null) => {
        setListTableScrollElState(el);
    }, []);

    const state = useMemo<ListTableLayoutFitMainState>(
        () => ({
            listTableHeight,
            listTableScrollEl,
        }),
        [listTableHeight, listTableScrollEl]
    );

    const actions = useMemo<ListTableLayoutFitMainActions<TAnchorEl>>(
        () => ({
            setAnchorEl,
            setListTableScrollEl,
        }),
        [setAnchorEl, setListTableScrollEl]
    );

    return { state, actions };
};

