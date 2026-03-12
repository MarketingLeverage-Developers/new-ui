import React from 'react';
import { FiDownload, FiPause, FiRefreshCw } from 'react-icons/fi';
import { PiGearSix } from 'react-icons/pi';
import TextAccordion from '../TextAccordion/TextAccordion';
import InfoTileCard, { type InfoTileCardItem } from '../InfoTileCard/InfoTileCard';
import BlackButton from '../Button/BlackButton';
import GrayButton from '../Button/GrayButton';
import IconButton from '../Button/IconButton';
import IconStrongButton from '../Button/IconStrongButton';
import WhiteButton from '../Button/WhiteButton';
import ButtonDropdown from '../ButtonDropdown/ButtonDropdown';
import CheckboxTextToggle from '../CheckboxTextToggle/CheckboxTextToggle';
import Flex from '../Flex/Flex';
import Grid from '../Grid/Grid';
import SearchToggleInput from '../SearchToggleInput/SearchToggleInput';
import ButtonSelect, { type ButtonSelectOption } from '../ButtonSelect/ButtonSelect';
import UnderlineTab from '../UnderlineTab/UnderlineTab';
import Tooltip from '../Tooltip/Tooltip';
import MerchantGroupsContent from './components/MerchantGroupsContent/MerchantGroupsContent';
import SearchInput from '../SearchInput/SearchInput';
import TextDisplay from '../TextDisplay/TextDisplay';
import TextIconButton from '../TextIconButton/TextIconButton';
import AlertText from '../AlertText/AlertText';
import InlineTextButton from '../InlineTextButton/InlineTextButton';
import MetricValueCard from '../MetricValueCard/MetricValueCard';
import MetricStatusCard from '../MetricStatusCard/MetricStatusCard';
import MetricCard from '../MetricCard/MetricCard';
import PlaceholderBlock from '../PlaceholderBlock/PlaceholderBlock';

export type HomeItemElementsPage =
    | 'cards'
    | 'accounts'
    | 'taxInvoiceList'
    | 'cashReceipts'
    | 'merchantGroups'
    | 'coupang';

export type HomeItemElementsContentProps = {
    page: HomeItemElementsPage;
};

type AssetGroup = {
    key: string;
    title: string;
    countLabel: string;
    items: InfoTileCardItem[];
};

type SummaryMetricItem = {
    key: string;
    title: string;
    main: string;
    sub?: string;
};

type CoupangSummaryRowItem = {
    label: string;
    value: string;
    tone?: 'danger' | 'up' | 'down';
};

type CoupangSummaryItem = {
    key: string;
    title: string;
    rows: CoupangSummaryRowItem[];
    total: string;
};

type UnderlineTabItemOption = {
    key: string;
    label: string;
    disabled?: boolean;
};

const getAmountTone = (value: string): 'default' | 'up' | 'down' => {
    const text = value.trim();
    if (text.startsWith('-')) return 'down';
    if (text.startsWith('+')) return 'up';
    return 'default';
};

const CARD_GROUPS: AssetGroup[] = [
    {
        key: 'kb-card',
        title: '국민카드',
        countLabel: '9개',
        items: [
            {
                key: 'kb-0880',
                icon: 'https://demo.granter.biz/logo/credit-card/kookmin-card-icon.png',
                name: 'KB국민 SME기업카드 0880',
                amount: '-38,195,718원',
                owner: '이',
                hasLink: true,
            },
            {
                key: 'mk-9061',
                icon: 'https://demo.granter.biz/logo/credit-card/kookmin-card-icon.png',
                name: '마케팅부 카드 9061',
                amount: '-2,532,300원',
                owner: '김',
                hasLink: true,
            },
            {
                key: 'kb-3839',
                icon: 'https://demo.granter.biz/logo/credit-card/kookmin-card-icon.png',
                name: 'KB국민 SME기업카드 3839',
                amount: '-511,900원',
                owner: '최',
                hasLink: true,
            },
            {
                key: 'kb-9809',
                icon: 'https://demo.granter.biz/logo/credit-card/kookmin-card-icon.png',
                name: 'KB국민 SME기업카드 9809',
                amount: '-277,000원',
                owner: '한',
                hasLink: true,
            },
            {
                key: 'kb-3863',
                icon: 'https://demo.granter.biz/logo/credit-card/kookmin-card-icon.png',
                name: 'KB국민 SME기업카드 3863',
                amount: '-30,900원',
                owner: '박',
                hasLink: true,
            },
            {
                key: 'kb-0862',
                icon: 'https://demo.granter.biz/logo/credit-card/kookmin-card-icon.png',
                name: 'KB국민 SME기업카드 0862',
                amount: '0원',
                hasLink: true,
            },
        ],
    },
    {
        key: 'hyundai-card',
        title: '현대카드',
        countLabel: '1개',
        items: [
            {
                key: 'hy-8900',
                icon: 'https://demo.granter.biz/logo/credit-card/hyundai-card.png',
                name: '개인카드 890*',
                amount: '-1,278,000원',
                hasLink: true,
            },
        ],
    },
    {
        key: 'bc-card',
        title: 'BC카드',
        countLabel: '3개',
        items: [
            {
                key: 'bc-5323',
                icon: 'https://demo.granter.biz/logo/credit-card/bc-card-icon.png',
                name: 'BC카드 5323',
                amount: '0원',
                hasLink: true,
            },
            {
                key: 'bc-0939',
                icon: 'https://demo.granter.biz/logo/credit-card/bc-card-icon.png',
                name: '동남상가드림 카드 0939',
                amount: '0원',
                hasLink: true,
            },
            {
                key: 'bc-2933',
                icon: 'https://demo.granter.biz/logo/credit-card/bc-card-icon.png',
                name: '윤원수 복지카드 2933',
                amount: '0원',
                hasLink: true,
            },
        ],
    },
];

const ACCOUNT_GROUPS: AssetGroup[] = [
    {
        key: 'shinhan',
        title: '신한은행',
        countLabel: '4개',
        items: [
            {
                key: 'sh-7704',
                icon: 'https://demo.granter.biz/logo/account/shinhan-bank-logo.png',
                name: '입출금통장 7704',
                amount: '144,765,365원',
                delta: '+73,121,768원',
                owner: '이',
                hasLink: true,
            },
            {
                key: 'sh-0383',
                icon: 'https://demo.granter.biz/logo/account/shinhan-bank-logo.png',
                name: '서브통장 0383',
                amount: '0원',
                delta: '-28,579,072원',
                owner: '김',
                hasLink: true,
            },
            {
                key: 'sh-5548',
                icon: 'https://demo.granter.biz/logo/account/shinhan-bank-logo.png',
                name: '예금통장 5548',
                amount: '18,004,776원',
                delta: '+18,005,776원',
                owner: '박',
                hasLink: true,
            },
            {
                key: 'sh-2561',
                icon: 'https://demo.granter.biz/logo/account/shinhan-bank-logo.png',
                name: '마이너스통장 2561',
                amount: '0원',
                owner: '최',
                hasLink: true,
            },
        ],
    },
    {
        key: 'kbank',
        title: '카뱅',
        countLabel: '6개',
        items: [
            {
                key: 'kbk-3029',
                icon: 'https://demo.granter.biz/logo/account/kakaobank-logo.png',
                name: '마이너스 3029',
                amount: '10,708,236원',
                delta: '-8,521,022원',
            },
            {
                key: 'kbk-1',
                icon: 'https://demo.granter.biz/logo/account/kakaobank-logo.png',
                name: '임시계좌 1',
                amount: '-1,000,000원',
            },
            {
                key: 'kbk-123',
                icon: 'https://demo.granter.biz/logo/account/kakaobank-logo.png',
                name: '평가리 계좌 123',
                amount: '0원',
            },
        ],
    },
    {
        key: 'kookmin-bank',
        title: '국민은행',
        countLabel: '1개',
        items: [
            {
                key: 'km-7194',
                icon: 'https://demo.granter.biz/logo/account/kookmin-bank-logo.png',
                name: 'KB이자통장 7194',
                amount: '1,230원',
                owner: '이',
                hasLink: true,
            },
        ],
    },
];

const TAX_SUMMARY: SummaryMetricItem[] = [
    { key: 'sales', title: '매출', main: '+8,304,145원', sub: '미수금 8,304,145원' },
    { key: 'purchase', title: '매입', main: '-22,885,624원', sub: '미지급금 22,885,624원' },
];

const CASH_SUMMARY: SummaryMetricItem[] = [
    { key: 'sales', title: '매출', main: '0원' },
    { key: 'purchase', title: '매입', main: '0원' },
];

const MERCHANT_SUMMARY: SummaryMetricItem[] = [
    { key: 'day-average', title: '일 평균 결제금액', main: '256,666원', sub: '/ 일 평균 1건' },
    { key: 'per-payment', title: '건당 평균 결제금액', main: '256,666원', sub: '/ 총 3건' },
    { key: 'visit', title: '고객당 평균 방문 횟수', main: '1.00회' },
    { key: 'retention', title: '신규/재방문 고객', main: '3명 / 0명', sub: '(재방문율 0.00%)' },
];

const COUPANG_SUMMARY: CoupangSummaryItem[] = [
    {
        key: 'settlement',
        title: '정산 금액',
        rows: [
            { label: '정산 예정', value: '0원' },
            { label: '정산 완료', value: '6,762,574원' },
        ],
        total: '+6,762,574원',
    },
    {
        key: 'sales',
        title: '매출',
        rows: [
            { label: '판매액', value: '13,156,219원' },
            { label: '취소금액', value: '-2,814,081원', tone: 'danger' },
        ],
        total: '+10,342,138원',
    },
    {
        key: 'cost',
        title: '총 비용',
        rows: [
            { label: '판매수수료', value: '-888,225원', tone: 'danger' },
            { label: '광고비', value: '-2,256,333원', tone: 'danger' },
            { label: '그 외 15개 항목', value: '' },
        ],
        total: '-3,579,558원',
    },
    {
        key: 'ratio',
        title: '정산 비율',
        rows: [
            { label: '이익 비율', value: '65.4%' },
            { label: '비용 비율', value: '34.6%' },
        ],
        total: '65.4%',
    },
];

const TAX_INVOICE_TABS: UnderlineTabItemOption[] = [
    { key: 'issued', label: '발급완료' },
    { key: 'pending', label: '발급대기' },
    { key: 'failed', label: '발급실패' },
];

const CASH_RECEIPT_TABS: UnderlineTabItemOption[] = [
    { key: 'issued', label: '발급완료' },
    { key: 'pending', label: '발급대기' },
];

const COUPANG_TABS: UnderlineTabItemOption[] = [
    { key: 'all', label: '전체' },
    { key: 'rocket', label: '로켓그로스' },
    { key: 'default', label: '일반' },
];

const ISSUE_DROPDOWN_OPTIONS: ButtonSelectOption[] = [
    { value: 'issue-single', label: '개별 발급' },
    { value: 'issue-bulk', label: '일괄 발급' },
    { value: 'issue-setting', label: '발급 설정' },
];

const COUPANG_LINK_DROPDOWN_OPTIONS: ButtonSelectOption[] = [
    { value: 'integration-info', label: '연동 정보' },
    { value: 're-auth', label: '재인증' },
];

const SORT_OPTIONS = [
    { value: 'amount-desc', label: '사용금액순' },
    { value: 'amount-asc', label: '사용금액 낮은순' },
    { value: 'latest', label: '최신순' },
    { value: 'oldest', label: '오래된순' },
];

const SUMMARY_DOWNLOAD_OPTIONS = [
    { value: 'download-current', label: '현재 화면 다운로드' },
    { value: 'download-all', label: '전체 내역 다운로드' },
];

const SEARCH_ACTION_DOWNLOAD_OPTIONS = [
    { value: 'download-current', label: '현재 검색결과 다운로드' },
    { value: 'download-all', label: '전체 내역 다운로드' },
];

const getDefaultSortValue = (label: string) =>
    SORT_OPTIONS.find((option) => option.label === label)?.value ?? SORT_OPTIONS[0].value;

const getSortLabel = (value: string) =>
    SORT_OPTIONS.find((option) => option.value === value)?.label ?? SORT_OPTIONS[0].label;

const CardsPage = () => {
    const title = '지출 -42,825,818원';
    const sortDefaultValue = getDefaultSortValue('사용금액순');
    const [sortValue, setSortValue] = React.useState(sortDefaultValue);

    return (
        <Flex direction="column" gap={12} width="100%" minHeight="100%" paddingX={20} paddingY={20} background="var(--granter-white)">
            <Flex align="flex-start" justify="space-between" gap={12} wrap="wrap">
                <Flex align="center" gap={10} minWidth={0} wrap="wrap">
                    <Tooltip content={title}>
                        <Flex direction="column" minWidth={0}>
                            <TextDisplay variant="headline">{title}</TextDisplay>
                        </Flex>
                    </Tooltip>

                    <Tooltip content="동기화 새로고침">
                        <IconStrongButton size="icon-wide" aria-label="새로고침" leftIcon={<FiRefreshCw size={14} />} />
                    </Tooltip>

                    <Tooltip content="자동 동기화 일시정지">
                        <IconStrongButton size="icon-wide" aria-label="일시정지" leftIcon={<FiPause size={14} />} />
                    </Tooltip>

                    <BlackButton size="md">
                        전체내역
                    </BlackButton>
                </Flex>

                <ButtonDropdown widthPreset="download">
                    <ButtonDropdown.Trigger
                        label="다운로드"
                        variant="outline"
                        size="lg"
                        leftIcon={<FiDownload size={14} />}
                        showDropdownIcon={false}
                        aria-label="다운로드 옵션"
                    />
                    <ButtonDropdown.Content placement="bottom-end">
                        {SUMMARY_DOWNLOAD_OPTIONS.map((option) => (
                            <ButtonDropdown.Item key={option.value} value={option.value}>
                                {option.label}
                            </ButtonDropdown.Item>
                        ))}
                    </ButtonDropdown.Content>
                </ButtonDropdown>
            </Flex>

            <Flex align="center" justify="flex-end" gap={8}>
                <ButtonDropdown value={sortValue} onChange={setSortValue}>
                    <ButtonDropdown.Trigger
                        label={getSortLabel(sortValue)}
                        variant="ghost"
                        size="md"
                        aria-label="정렬 기준"
                    />
                    <ButtonDropdown.Content placement="bottom-end">
                        {SORT_OPTIONS.map((option) => (
                            <ButtonDropdown.Item key={option.value} value={option.value}>
                                {option.label}
                            </ButtonDropdown.Item>
                        ))}
                    </ButtonDropdown.Content>
                </ButtonDropdown>
                <SearchToggleInput placeholder="카드명, 거래처 검색" />
            </Flex>

            <Flex direction="column" gap={16}>
                {CARD_GROUPS.map((group) => (
                    <TextAccordion key={group.key} title={group.title} countLabel={group.countLabel}>
                        {group.items.map((item) => (
                            <InfoTileCard key={item.key} item={item} />
                        ))}
                    </TextAccordion>
                ))}
            </Flex>
        </Flex>
    );
};

const AccountsPage = () => {
    const title = '11월 30일 잔액 172,479,607원';
    const subtitle = '54,027,450원 늘었어요.';
    const sortDefaultValue = getDefaultSortValue('사용금액순');
    const [sortValue, setSortValue] = React.useState(sortDefaultValue);

    return (
        <Flex direction="column" gap={12} width="100%" minHeight="100%" paddingX={20} paddingY={20} background="var(--granter-white)">
            <Flex align="flex-start" justify="space-between" gap={12} wrap="wrap">
                <Flex align="center" gap={10} minWidth={0} wrap="wrap">
                    <Tooltip content={`${title}\n${subtitle}`}>
                        <Flex direction="column" minWidth={0}>
                            <TextDisplay variant="headline">{title}</TextDisplay>
                            <TextDisplay variant="emphasis">{subtitle}</TextDisplay>
                        </Flex>
                    </Tooltip>

                    <Tooltip content="동기화 새로고침">
                        <IconStrongButton size="icon-wide" aria-label="새로고침" leftIcon={<FiRefreshCw size={14} />} />
                    </Tooltip>

                    <Tooltip content="자동 동기화 일시정지">
                        <IconStrongButton size="icon-wide" aria-label="일시정지" leftIcon={<FiPause size={14} />} />
                    </Tooltip>

                    <BlackButton size="md">
                        전체내역
                    </BlackButton>
                </Flex>

                <ButtonDropdown widthPreset="download">
                    <ButtonDropdown.Trigger
                        label="다운로드"
                        variant="outline"
                        size="lg"
                        leftIcon={<FiDownload size={14} />}
                        showDropdownIcon={false}
                        aria-label="다운로드 옵션"
                    />
                    <ButtonDropdown.Content placement="bottom-end">
                        {SUMMARY_DOWNLOAD_OPTIONS.map((option) => (
                            <ButtonDropdown.Item key={option.value} value={option.value}>
                                {option.label}
                            </ButtonDropdown.Item>
                        ))}
                    </ButtonDropdown.Content>
                </ButtonDropdown>
            </Flex>

            <Flex align="center" justify="flex-end" gap={8}>
                <ButtonDropdown value={sortValue} onChange={setSortValue}>
                    <ButtonDropdown.Trigger
                        label={getSortLabel(sortValue)}
                        variant="ghost"
                        size="md"
                        aria-label="정렬 기준"
                    />
                    <ButtonDropdown.Content placement="bottom-end">
                        {SORT_OPTIONS.map((option) => (
                            <ButtonDropdown.Item key={option.value} value={option.value}>
                                {option.label}
                            </ButtonDropdown.Item>
                        ))}
                    </ButtonDropdown.Content>
                </ButtonDropdown>
                <SearchToggleInput placeholder="계좌명, 거래처 검색" />
            </Flex>

            <Flex direction="column" gap={16}>
                {ACCOUNT_GROUPS.map((group) => (
                    <TextAccordion key={group.key} title={group.title} countLabel={group.countLabel}>
                        {group.items.map((item) => (
                            <InfoTileCard key={item.key} item={item} />
                        ))}
                    </TextAccordion>
                ))}
            </Flex>
        </Flex>
    );
};

const TaxInvoiceContent = () => {
    const [keyword, setKeyword] = React.useState('');

    return (
        <Flex direction="column" gap={18} width="100%" minHeight="100%" paddingX={20} paddingY={20} background="var(--granter-white)">
            <Flex align="center" justify="space-between" gap={12} wrap="wrap">
                <TextIconButton variant="page" icon={<PiGearSix size={16} color="var(--granter-gray-400)" />}>세금계산서</TextIconButton>
                <ButtonSelect label="발급" variant="black" defaultValue={ISSUE_DROPDOWN_OPTIONS[0]?.value}>
                    {ISSUE_DROPDOWN_OPTIONS.map((option) => (
                        <ButtonSelect.Item key={option.value} value={option.value} disabled={option.disabled} onSelect={option.onSelect}>
                            {option.label}
                        </ButtonSelect.Item>
                    ))}
                </ButtonSelect>
            </Flex>

            <UnderlineTab defaultValue={TAX_INVOICE_TABS[0]?.key}>
                {TAX_INVOICE_TABS.map((item) => (
                    <UnderlineTab.Item key={item.key} value={item.key} disabled={item.disabled}>
                        {item.label}
                    </UnderlineTab.Item>
                ))}
            </UnderlineTab>

            <Grid gap={8} templateColumns="repeat(2, max-content) max-content" templateColumnsTablet="repeat(2, max-content)" templateColumnsMobile="1fr">
                {TAX_SUMMARY.map((item) => (
                    <MetricValueCard
                        key={item.key}
                        variant="compact"
                        title={item.title}
                        value={item.main}
                        valueTone={getAmountTone(item.main)}
                        sub={item.sub}
                    />
                ))}

                <MetricStatusCard label="연결 필요" count="18" action="AI 연결" />
            </Grid>

            <Grid
                templateColumns="minmax(360px, 1fr) auto auto"
                templateColumnsTablet="minmax(280px, 1fr)"
                templateColumnsMobile="minmax(280px, 1fr)"
                gap={8}
                alignItems="center"
            >
                <SearchInput value={keyword} onValueChange={setKeyword} placeholder="사용처, 계정과목, 사유, 태그 검색" />

                <Flex align="center" gap={8}>
                    <GrayButton size="md">
                        다중 수정
                    </GrayButton>
                    <GrayButton size="md">
                        분류 자동화
                    </GrayButton>
                </Flex>

                <Flex align="center" gap={8}>
                    <CheckboxTextToggle label="제외내역 보기" />

                    <ButtonDropdown widthPreset="download">
                        <ButtonDropdown.Trigger
                            label="다운로드"
                            variant="outline"
                            size="lg"
                            leftIcon={<FiDownload size={14} />}
                            showDropdownIcon={false}
                            aria-label="다운로드 옵션"
                        />
                        <ButtonDropdown.Content placement="bottom-end">
                            {SEARCH_ACTION_DOWNLOAD_OPTIONS.map((option) => (
                                <ButtonDropdown.Item key={option.value} value={option.value}>
                                    {option.label}
                                </ButtonDropdown.Item>
                            ))}
                        </ButtonDropdown.Content>
                    </ButtonDropdown>

                    <IconButton size="icon" aria-label="설정" leftIcon={<PiGearSix size={16} />} />
                </Flex>
            </Grid>

            <PlaceholderBlock>세금계산서 테이블 영역은 보류</PlaceholderBlock>
        </Flex>
    );
};

const CashReceiptsContent = () => {
    const [keyword, setKeyword] = React.useState('');

    return (
        <Flex direction="column" gap={12} width="100%" minHeight="100%" paddingX={20} paddingY={20} background="var(--granter-white)">
            <Flex align="center" justify="space-between" gap={12} wrap="wrap">
                <TextIconButton variant="page" icon={<PiGearSix size={16} color="var(--granter-gray-400)" />}>현금영수증</TextIconButton>
                <ButtonSelect label="발급" variant="black" defaultValue={ISSUE_DROPDOWN_OPTIONS[0]?.value}>
                    {ISSUE_DROPDOWN_OPTIONS.map((option) => (
                        <ButtonSelect.Item key={option.value} value={option.value} disabled={option.disabled} onSelect={option.onSelect}>
                            {option.label}
                        </ButtonSelect.Item>
                    ))}
                </ButtonSelect>
            </Flex>

            <UnderlineTab defaultValue={CASH_RECEIPT_TABS[0]?.key}>
                {CASH_RECEIPT_TABS.map((item) => (
                    <UnderlineTab.Item key={item.key} value={item.key} disabled={item.disabled}>
                        {item.label}
                    </UnderlineTab.Item>
                ))}
            </UnderlineTab>

            <Grid gap={8} templateColumns="repeat(2, max-content)" templateColumnsMobile="1fr">
                {CASH_SUMMARY.map((item) => (
                    <MetricValueCard
                        key={item.key}
                        variant="compact"
                        title={item.title}
                        value={item.main}
                        valueTone={getAmountTone(item.main)}
                        sub={item.sub}
                    />
                ))}
            </Grid>

            <Grid
                templateColumns="minmax(360px, 1fr) auto auto"
                templateColumnsTablet="minmax(280px, 1fr)"
                templateColumnsMobile="minmax(280px, 1fr)"
                gap={8}
                alignItems="center"
            >
                <SearchInput value={keyword} onValueChange={setKeyword} placeholder="사용처, 계정과목, 사유, 태그 검색" />

                <Flex align="center" gap={8}>
                    <GrayButton size="md">
                        다중 수정
                    </GrayButton>
                    <GrayButton size="md">
                        분류 자동화
                    </GrayButton>
                </Flex>

                <Flex align="center" gap={8}>
                    <CheckboxTextToggle label="제외내역 보기" />

                    <ButtonDropdown widthPreset="download">
                        <ButtonDropdown.Trigger
                            label="다운로드"
                            variant="outline"
                            size="lg"
                            leftIcon={<FiDownload size={14} />}
                            showDropdownIcon={false}
                            aria-label="다운로드 옵션"
                        />
                        <ButtonDropdown.Content placement="bottom-end">
                            {SEARCH_ACTION_DOWNLOAD_OPTIONS.map((option) => (
                                <ButtonDropdown.Item key={option.value} value={option.value}>
                                    {option.label}
                                </ButtonDropdown.Item>
                            ))}
                        </ButtonDropdown.Content>
                    </ButtonDropdown>

                    <IconButton size="icon" aria-label="설정" leftIcon={<PiGearSix size={16} />} />
                </Flex>
            </Grid>

            <PlaceholderBlock>현금영수증 테이블 영역은 보류</PlaceholderBlock>
        </Flex>
    );
};

const MerchantGroupsPage = () => (
    <Flex direction="column" gap={12} width="100%" minHeight="100%" paddingX={20} paddingY={20} background="var(--granter-white)">
        <Flex align="center" justify="space-between" gap={12} wrap="wrap">
            <TextIconButton variant="page" icon={<PiGearSix size={16} color="var(--granter-gray-400)" />}>매출</TextIconButton>
        </Flex>

        <Grid columns={4} columnsTablet={2} columnsMobile={1} gap={10}>
            {MERCHANT_SUMMARY.map((item) => (
                <MetricValueCard
                    key={item.key}
                    variant="standard"
                    title={item.title}
                    value={item.main}
                    valueTone={getAmountTone(item.main)}
                    sub={item.sub}
                />
            ))}
        </Grid>

        <PlaceholderBlock>포스기 차트 영역은 보류</PlaceholderBlock>

        <MerchantGroupsContent />
    </Flex>
);

const CoupangPage = () => {
    const [keyword, setKeyword] = React.useState('');

    return (
        <Flex direction="column" gap={16} width="100%" minHeight="100%" paddingX={20} paddingY={20} background="var(--granter-white)">
            <Flex align="flex-start" justify="space-between" gap={24} wrap="wrap">
                <Flex direction="column" gap={8} minWidth={0}>
                    <TextIconButton variant="hero" icon={<PiGearSix size={16} color="var(--granter-gray-500)" />}>
                        쿠팡 윙 정산 현황
                    </TextIconButton>

                    <AlertText>
                        연동 정보가 만료되었습니다.{' '}
                        <InlineTextButton>재인증</InlineTextButton>
                        이 필요해요.
                    </AlertText>
                </Flex>

                <Flex align="center" gap={8} flexShrink={0}>
                    <WhiteButton size="md">
                        서플라이어 허브 연동신청
                    </WhiteButton>
                    <ButtonSelect label="연동" variant="white" defaultValue={COUPANG_LINK_DROPDOWN_OPTIONS[0]?.value}>
                        {COUPANG_LINK_DROPDOWN_OPTIONS.map((option) => (
                            <ButtonSelect.Item key={option.value} value={option.value} disabled={option.disabled} onSelect={option.onSelect}>
                                {option.label}
                            </ButtonSelect.Item>
                        ))}
                    </ButtonSelect>
                </Flex>
            </Flex>

            <Grid columns={4} columnsTablet={2} columnsMobile={1} gap={8} marginY={16}>
                {COUPANG_SUMMARY.map((item) => (
                    <MetricCard key={item.key} variant="detail" title={item.title} rows={item.rows} total={item.total} />
                ))}
            </Grid>

            <Flex direction="column" gap={24}>
                <UnderlineTab defaultValue={COUPANG_TABS[0]?.key}>
                    {COUPANG_TABS.map((item) => (
                        <UnderlineTab.Item key={item.key} value={item.key} disabled={item.disabled}>
                            {item.label}
                        </UnderlineTab.Item>
                    ))}
                </UnderlineTab>

                <Flex align="center" justify="space-between" gap={8}>
                    <SearchInput
                        value={keyword}
                        onValueChange={setKeyword}
                        widthPreset="coupang"
                        placeholder="타입, 정산유형, 정산상태, 정산일 검색"
                        ariaLabel="정산 검색"
                    />

                    <IconButton size="icon" aria-label="다운로드" leftIcon={<FiDownload size={16} />} />
                </Flex>
            </Flex>

            <PlaceholderBlock variant="solid">쿠팡 테이블 영역은 보류</PlaceholderBlock>
        </Flex>
    );
};

const HomeItemElementsContent = ({ page }: HomeItemElementsContentProps) => {
    if (page === 'cards') return <CardsPage />;
    if (page === 'accounts') return <AccountsPage />;
    if (page === 'taxInvoiceList') return <TaxInvoiceContent />;
    if (page === 'cashReceipts') return <CashReceiptsContent />;
    if (page === 'merchantGroups') return <MerchantGroupsPage />;
    return <CoupangPage />;
};

export default HomeItemElementsContent;
