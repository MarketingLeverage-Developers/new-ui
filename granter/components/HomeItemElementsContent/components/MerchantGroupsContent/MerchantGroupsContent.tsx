import React, { useCallback, useMemo, useState } from 'react';
import { FiDownload, FiMessageCircle, FiSearch } from 'react-icons/fi';
import { HiOutlineChevronDown } from 'react-icons/hi2';
import { IoCloseOutline } from 'react-icons/io5';
import { PiGearSix } from 'react-icons/pi';
import type { Column } from '../../../../../shared/headless/AirTable/AirTable';
import HeadlessDropdown from '../../../../../shared/headless/Dropdown/Dropdown';
import Select from '../../../../../shared/headless/Select/Select';
import GrayButton from '../../../Button/GrayButton';
import IconButton from '../../../Button/IconButton';
import PlainButton from '../../../Button/PlainButton';
import ButtonDropdown from '../../../ButtonDropdown/ButtonDropdown';
import Flex from '../../../Flex/Flex';
import DataTable from '../../../DataTable/DataTable';
import Text from '../../../Text/Text';
import CheckboxTextToggle from '../../../CheckboxTextToggle/CheckboxTextToggle';
import styles from './MerchantGroupsContent.module.scss';

type MerchantRow = {
    id: string;
    dateLabel: string;
    timeLabel: string;
    dateSortKey: string;
    paymentMethod: string;
    paymentMethodCode: string;
    merchant: string;
    amount: number;
    account: string;
    reason: string;
    tag: string;
    hasComment: boolean;
    excluded: boolean;
};

type MerchantColumnKey = 'date' | 'paymentMethod' | 'merchant' | 'amount' | 'account' | 'reason' | 'tag';

type CellSelectOption = {
    value: string;
    label: string;
    iconSrc?: string;
};

const DOWNLOAD_OPTIONS = [
    { value: 'download-current', label: '현재 검색결과 다운로드' },
    { value: 'download-all', label: '전체 내역 다운로드' },
];

const ACCOUNT_OPTIONS: CellSelectOption[] = [
    {
        value: 'service-sales',
        label: '서비스매출',
        iconSrc: 'https://plutus-app-public-assets.s3.ap-northeast-2.amazonaws.com/category/%E1%84%89%E1%85%A5%E1%84%87%E1%85%B5%E1%84%89%E1%85%B3%E1%84%86%E1%85%A2%E1%84%8E%E1%85%AE%E1%86%AF.png',
    },
    { value: 'product-sales', label: '상품매출' },
    { value: 'etc-sales', label: '기타매출' },
];

const TAG_OPTIONS: CellSelectOption[] = [
    { value: '', label: '' },
    { value: '광고', label: '광고' },
    { value: '행사', label: '행사' },
    { value: '운영', label: '운영' },
];

const COLUMN_OPTIONS: { key: MerchantColumnKey; label: string }[] = [
    { key: 'date', label: '일시' },
    { key: 'paymentMethod', label: '거래수단' },
    { key: 'merchant', label: '사용처' },
    { key: 'amount', label: '금액' },
    { key: 'account', label: '계정과목' },
    { key: 'reason', label: '사유' },
    { key: 'tag', label: '태그' },
];

const INITIAL_ROWS: MerchantRow[] = [
    {
        id: 'merchant-001',
        dateLabel: '10월12일(토)',
        timeLabel: '11시30분',
        dateSortKey: '2024-10-12T11:30:00',
        paymentMethod: '화랑 세무회계',
        paymentMethodCode: '1370',
        merchant: '화랑 세무회계←하나카드 (5320-92*-*-*)',
        amount: 110000,
        account: 'service-sales',
        reason: '마곡 지점 포스기 1번 매출 항목',
        tag: '',
        hasComment: false,
        excluded: false,
    },
    {
        id: 'merchant-002',
        dateLabel: '10월2일(수)',
        timeLabel: '16시3분',
        dateSortKey: '2024-10-02T16:03:00',
        paymentMethod: '화랑 세무회계',
        paymentMethodCode: '1370',
        merchant: '화랑 세무회계←신한카드 (4658-87*-*-*)',
        amount: 220000,
        account: 'service-sales',
        reason: '마곡 지점 포스기 3번 매출 항목',
        tag: '',
        hasComment: false,
        excluded: false,
    },
    {
        id: 'merchant-003',
        dateLabel: '9월27일(금)',
        timeLabel: '14시44분',
        dateSortKey: '2024-09-27T14:44:00',
        paymentMethod: '화랑 세무회계',
        paymentMethodCode: '1370',
        merchant: '화랑 세무회계←KB카드 (5272-89*-*-*)',
        amount: 440000,
        account: 'service-sales',
        reason: '',
        tag: '',
        hasComment: false,
        excluded: false,
    },
    {
        id: 'merchant-004',
        dateLabel: '9월18일(수)',
        timeLabel: '13시22분',
        dateSortKey: '2024-09-18T13:22:00',
        paymentMethod: '화랑 세무회계',
        paymentMethodCode: '1370',
        merchant: '화랑 세무회계←하나카드 (1000-11*-*-*)',
        amount: 120000,
        account: 'service-sales',
        reason: '이중 수집 데이터',
        tag: '운영',
        hasComment: false,
        excluded: true,
    },
    {
        id: 'merchant-005',
        dateLabel: '9월11일(수)',
        timeLabel: '9시15분',
        dateSortKey: '2024-09-11T09:15:00',
        paymentMethod: '화랑 세무회계',
        paymentMethodCode: '1370',
        merchant: '화랑 세무회계←국민카드 (7000-44*-*-*)',
        amount: 70000,
        account: 'etc-sales',
        reason: '테스트 데이터',
        tag: '행사',
        hasComment: true,
        excluded: true,
    },
];

const formatSignedCurrency = (value: number) => {
    const sign = value >= 0 ? '+' : '-';
    return `${sign}${Math.abs(value).toLocaleString()}원`;
};

const stopCellMouseDown: React.MouseEventHandler<HTMLElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
};

const HeaderCell = ({
    children,
    align = 'left',
}: {
    children: React.ReactNode;
    align?: 'left' | 'center' | 'right';
}) => (
    <div className={styles.HeaderCellInner} data-align={align}>
        {children}
    </div>
);

const Cell = ({
    children,
    align = 'left',
}: {
    children: React.ReactNode;
    align?: 'left' | 'center' | 'right';
}) => (
    <div className={styles.CellInner} data-align={align}>
        {children}
    </div>
);

const CellSelect = ({
    value,
    options,
    placeholder,
    onChange,
    withIcon = false,
    tone = 'default',
}: {
    value: string;
    options: CellSelectOption[];
    placeholder?: string;
    onChange: (value: string) => void;
    withIcon?: boolean;
    tone?: 'default' | 'muted';
}) => {
    const selectedOption = options.find((option) => option.value === value);
    const displayLabel = selectedOption?.label || placeholder || '';

    return (
        <Select value={value} onChange={onChange}>
            <HeadlessDropdown>
                <HeadlessDropdown.Trigger className={styles.SelectTriggerWrap}>
                    <button
                        type="button"
                        className={styles.SelectTrigger}
                        data-tone={tone}
                        onMouseDown={stopCellMouseDown}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <span className={styles.SelectLabelWrap}>
                            {withIcon && selectedOption?.iconSrc ? (
                                <img className={styles.SelectIcon} src={selectedOption.iconSrc} alt="" />
                            ) : null}
                            <span className={styles.SelectLabel}>{displayLabel}</span>
                        </span>
                        <span className={styles.SelectChevron}>
                            <HiOutlineChevronDown size={14} />
                        </span>
                    </button>
                </HeadlessDropdown.Trigger>

                <HeadlessDropdown.Content className={styles.SelectMenu} placement="bottom-start">
                    {options.map((option) => (
                        <Select.Item
                            key={option.value || '__empty__'}
                            value={option.value}
                            className={styles.SelectOption}
                            onMouseDown={stopCellMouseDown}
                            onClick={(event) => {
                                if (typeof event !== 'string') {
                                    event.stopPropagation();
                                }
                            }}
                        >
                            {withIcon && option.iconSrc ? <img className={styles.SelectIcon} src={option.iconSrc} alt="" /> : null}
                            <span>{option.label || '선택 안함'}</span>
                        </Select.Item>
                    ))}
                </HeadlessDropdown.Content>
            </HeadlessDropdown>
        </Select>
    );
};

const SettingsMenu = ({
    hiddenColumnKeys,
    onToggleColumn,
    onShowAll,
    onHideAll,
}: {
    hiddenColumnKeys: MerchantColumnKey[];
    onToggleColumn: (key: MerchantColumnKey) => void;
    onShowAll: () => void;
    onHideAll: () => void;
}) => (
    <HeadlessDropdown>
        <HeadlessDropdown.Trigger className={styles.SettingsTrigger}>
            <IconButton size="icon" aria-label="컬럼 설정" leftIcon={<PiGearSix size={16} />} />
        </HeadlessDropdown.Trigger>

        <HeadlessDropdown.Content className={styles.SettingsMenu} placement="bottom-end">
            <div className={styles.SettingsHeader}>
                <Text size="sm" weight="semibold">
                    컬럼 표시
                </Text>
                <Flex align="center" gap={6}>
                    <button type="button" className={styles.SettingsTextButton} onClick={onShowAll}>
                        전체
                    </button>
                    <span className={styles.SettingsDivider} />
                    <button type="button" className={styles.SettingsTextButton} onClick={onHideAll}>
                        기본
                    </button>
                </Flex>
            </div>

            <div className={styles.SettingsList}>
                {COLUMN_OPTIONS.map((option) => {
                    const checked = !hiddenColumnKeys.includes(option.key);
                    return (
                        <label key={option.key} className={styles.SettingsRow}>
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => onToggleColumn(option.key)}
                                onMouseDown={(event) => event.stopPropagation()}
                            />
                            <span>{option.label}</span>
                        </label>
                    );
                })}
            </div>
        </HeadlessDropdown.Content>
    </HeadlessDropdown>
);

const MerchantGroupsContent = () => {
    const [rows, setRows] = useState<MerchantRow[]>(INITIAL_ROWS);
    const [keyword, setKeyword] = useState('');
    const [showExcluded, setShowExcluded] = useState(false);
    const [hiddenColumnKeys, setHiddenColumnKeys] = useState<MerchantColumnKey[]>([]);

    const normalizedKeyword = keyword.trim().toLowerCase();

    const filteredRows = useMemo(
        () =>
            rows.filter((row) => {
                if (!showExcluded && row.excluded) return false;
                if (!normalizedKeyword) return true;

                const searchable = [
                    row.dateLabel,
                    row.timeLabel,
                    row.paymentMethod,
                    row.paymentMethodCode,
                    row.merchant,
                    row.reason,
                    row.tag,
                ]
                    .join(' ')
                    .toLowerCase();

                return searchable.includes(normalizedKeyword);
            }),
        [normalizedKeyword, rows, showExcluded]
    );

    const totalAmount = useMemo(
        () => filteredRows.reduce((sum, row) => sum + row.amount, 0),
        [filteredRows]
    );

    const onToggleColumn = useCallback((key: MerchantColumnKey) => {
        setHiddenColumnKeys((prev) => (prev.includes(key) ? prev.filter((columnKey) => columnKey !== key) : [...prev, key]));
    }, []);

    const onShowAllColumns = useCallback(() => {
        setHiddenColumnKeys([]);
    }, []);

    const onShowDefaultColumns = useCallback(() => {
        setHiddenColumnKeys([]);
    }, []);

    const updateRowField = useCallback(
        (rowId: string, field: 'account' | 'tag', value: string) => {
            setRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)));
        },
        []
    );

    const columns = useMemo<Column<MerchantRow>[]>(() => {
        const allColumns: Column<MerchantRow>[] = [
            {
                key: 'comment',
                label: '댓글',
                width: 70,
                disablePinning: true,
                header: () => <HeaderCell align="center">댓글</HeaderCell>,
                render: (item) => (
                    <Cell align="center">
                        <button
                            type="button"
                            className={styles.CommentButton}
                            aria-label="댓글 보기"
                            data-active={item.hasComment ? 'true' : 'false'}
                            onMouseDown={stopCellMouseDown}
                            onClick={(event) => event.stopPropagation()}
                        >
                            <FiMessageCircle size={16} />
                        </button>
                    </Cell>
                ),
            },
            {
                key: 'date',
                label: '일시',
                width: 120,
                sortValue: (row) => row.dateSortKey,
                header: () => <HeaderCell>일시</HeaderCell>,
                render: (item) => (
                    <Cell>
                        <span className={styles.DateCell}>
                            <strong>{item.dateLabel}</strong>
                            <em>{item.timeLabel}</em>
                        </span>
                    </Cell>
                ),
            },
            {
                key: 'paymentMethod',
                label: '거래수단',
                width: 130,
                sortValue: (row) => `${row.paymentMethod}${row.paymentMethodCode}`,
                header: () => <HeaderCell>거래수단</HeaderCell>,
                render: (item) => (
                    <Cell>
                        <span className={styles.MethodCell}>
                            <span>{item.paymentMethod}</span>
                            <em>{item.paymentMethodCode}</em>
                        </span>
                    </Cell>
                ),
            },
            {
                key: 'merchant',
                label: '사용처',
                width: 260,
                sortValue: (row) => row.merchant,
                header: () => <HeaderCell>사용처</HeaderCell>,
                render: (item) => (
                    <Cell>
                        <span className={styles.Truncate}>{item.merchant}</span>
                    </Cell>
                ),
            },
            {
                key: 'amount',
                label: '금액',
                width: 140,
                sortValue: (row) => row.amount,
                header: () => <HeaderCell align="right">금액</HeaderCell>,
                render: (item) => (
                    <Cell align="right">
                        <span className={styles.AmountText}>{formatSignedCurrency(item.amount)}</span>
                    </Cell>
                ),
            },
            {
                key: 'account',
                label: '계정과목',
                width: 170,
                sortValue: (row) => row.account,
                header: () => <HeaderCell>계정과목</HeaderCell>,
                render: (item) => (
                    <Cell>
                        <CellSelect
                            value={item.account}
                            options={ACCOUNT_OPTIONS}
                            onChange={(next) => updateRowField(item.id, 'account', next)}
                            withIcon
                            tone="default"
                        />
                    </Cell>
                ),
            },
            {
                key: 'reason',
                label: '사유',
                width: 210,
                sortValue: (row) => row.reason,
                header: () => <HeaderCell>사유</HeaderCell>,
                render: (item) => (
                    <Cell>
                        <span className={styles.Truncate}>{item.reason}</span>
                    </Cell>
                ),
            },
            {
                key: 'tag',
                label: '태그',
                width: 200,
                sortValue: (row) => row.tag,
                header: () => <HeaderCell>태그</HeaderCell>,
                render: (item) => (
                    <Cell>
                        <CellSelect
                            value={item.tag}
                            options={TAG_OPTIONS}
                            onChange={(next) => updateRowField(item.id, 'tag', next)}
                            placeholder=""
                            tone="muted"
                        />
                    </Cell>
                ),
            },
        ];

        return allColumns.filter(
            (column) => column.key === 'comment' || !hiddenColumnKeys.includes(column.key as MerchantColumnKey)
        );
    }, [hiddenColumnKeys, updateRowField]);

    return (
        <div className={styles.Section}>
            <div className={styles.ControlRow}>
                <div className={styles.SearchField}>
                    <FiSearch size={16} />
                    <input
                        type="text"
                        value={keyword}
                        placeholder="사용처, 계정과목, 사유, 태그 검색"
                        aria-label="매출 내역 검색"
                        onChange={(event) => setKeyword(event.target.value)}
                    />
                    <PlainButton className={styles.ClearButton} aria-label="입력 지우기" onClick={() => setKeyword('')}>
                        <IoCloseOutline size={16} />
                    </PlainButton>
                </div>

                <div className={styles.ActionButtons}>
                    <GrayButton size="md">
                        다중 수정
                    </GrayButton>
                    <GrayButton size="md">
                        분류 자동화
                    </GrayButton>
                </div>

                <div className={styles.RightTools}>
                    <CheckboxTextToggle label="제외내역 보기" value={showExcluded} onValueChange={setShowExcluded} />

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
                            {DOWNLOAD_OPTIONS.map((option) => (
                                <ButtonDropdown.Item key={option.value} value={option.value}>
                                    {option.label}
                                </ButtonDropdown.Item>
                            ))}
                        </ButtonDropdown.Content>
                    </ButtonDropdown>

                    <SettingsMenu
                        hiddenColumnKeys={hiddenColumnKeys}
                        onToggleColumn={onToggleColumn}
                        onShowAll={onShowAllColumns}
                        onHideAll={onShowDefaultColumns}
                    />
                </div>
            </div>

            <div className={styles.MetaRow}>
                <Text size="sm" tone="muted">
                    검색결과 {filteredRows.length.toLocaleString()}건
                </Text>

                <Text size="sm" weight="semibold" tone={totalAmount >= 0 ? 'up' : 'down'}>
                    검색 합계 {formatSignedCurrency(totalAmount)}
                </Text>
            </div>

            <DataTable<MerchantRow>
                data={filteredRows}
                columns={columns}
                rowKeyField="id"
                storageKey="granter-merchant-groups-table-v3"
                height="auto"
            />
        </div>
    );
};

export default MerchantGroupsContent;
