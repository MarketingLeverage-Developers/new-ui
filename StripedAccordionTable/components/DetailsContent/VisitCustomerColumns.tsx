import type { Column } from '@/shared/headless/Table/Table';
import StripedTable from '@/shared/primitives/StripedTable/StripedTable';

export type VisitCustomer = {
    id: string;

    // 방문환경
    environment: string;

    // 방문수 / 광고 클릭수
    visits: number;
    adClicks: number;

    // 방문시간 (처음-마지막)
    firstVisit: string; // e.g. '2025-08-20 10:12'
    lastVisit: string; // e.g. '2025-08-20 18:45'

    // 전환수 / 매출
    conversions: number;
    revenue: number; // 원화 기준
};

// 필요 시 사용
export const VisitCustomerTypeLabel: Record<string, string> = {};

export const VisitCustomerColumns: () => Column<VisitCustomer>[] = () => [
    {
        key: 'id',
        header: () => <StripedTable.Content>ID</StripedTable.Content>,
        render: (item) => <StripedTable.Content>{item.id}</StripedTable.Content>,
        width: 100,
    },
    {
        key: 'environment',
        header: () => <StripedTable.Content>방문환경</StripedTable.Content>,
        render: (item) => <StripedTable.Content>{item.environment}</StripedTable.Content>,
        width: 180,
    },
    {
        key: 'visits',
        header: () => (
            <StripedTable.Content>
                방문수 <br /> 광고 클릭수
            </StripedTable.Content>
        ),
        render: (item) => (
            <StripedTable.Content>
                {item.visits.toLocaleString()} / {item.adClicks.toLocaleString()}
            </StripedTable.Content>
        ),
        width: 160,
    },
    {
        key: 'firstVisit',
        header: () => <StripedTable.Content>방문시간 (처음-마지막)</StripedTable.Content>,
        render: (item) => (
            <StripedTable.Content>
                <span>{item.firstVisit}</span> <br />
                <span>{item.lastVisit}</span>
            </StripedTable.Content>
        ),
        width: 240,
    },
    {
        key: 'conversions',
        header: () => <StripedTable.Content>전환수 매출</StripedTable.Content>,
        render: (item) => (
            <StripedTable.Content>
                {item.conversions.toLocaleString()} / {item.revenue.toLocaleString()}원
            </StripedTable.Content>
        ),
        width: 180,
    },
];
