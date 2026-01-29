import React, { useMemo } from 'react';
import classNames from 'classnames';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import { useQuerySearch } from '@/shared/headless/QuerySearch/QuerySearch';
import { useHangulSearch } from '@/shared/hooks/client/useHangulSearch';
import SearchInput from '@/shared/primitives/SearchInput/SearchInput';
import { useChipMultiSelectConfig } from '../../ChipMultiSelect';
import styles from './ChipMultiSelectContent.module.scss';

export type ChipMultiSelectContentProps = React.ComponentProps<typeof Dropdown.Content> & {
    className?: string;
    /** 검색 노출 여부 (기본: true) */
    searchable?: boolean;
    /** 검색 placeholder */
    searchPlaceholder?: string;
    /** 검색 결과 없음 문구 */
    emptyText?: string;
};

type OptionNode = {
    value: string;
    label: string;
    element: React.ReactElement;
};

const toText = (node: React.ReactNode): string => {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(toText).join(' ');
    if (React.isValidElement(node)) {
        const props = node.props as { children?: React.ReactNode };
        return toText(props.children);
    }
    return '';
};

const useOptionNodes = (children: React.ReactNode) =>
    useMemo<OptionNode[]>(() => {
        const nodes = React.Children.toArray(children);

        return nodes
            .map((child) => {
                if (!React.isValidElement(child)) return null;
                const element = child as React.ReactElement<{ value?: string; children?: React.ReactNode }>;
                const value = element.props?.value;
                if (typeof value !== 'string') return null;

                const label = toText(element.props?.children).trim() || value;
                return { value, label, element };
            })
            .filter(Boolean) as OptionNode[];
    }, [children]);

type ListProps = {
    options: OptionNode[];
    searchable: boolean;
    emptyText: string;
};

const ChipMultiSelectList: React.FC<ListProps> = ({ options, searchable, emptyText }) => {
    const { query, data } = useQuerySearch<{ uuid: string; label: string }>();
    const { filtered } = useHangulSearch<{ uuid: string; label: string }>(data, query, (it) => String(it.label ?? ''));

    const filteredSet = useMemo(() => new Set(filtered.map((it) => String(it.uuid ?? ''))), [filtered]);

    const target = useMemo(
        () => (searchable ? options.filter((opt) => filteredSet.has(opt.value)) : options),
        [filteredSet, options, searchable]
    );

    if (target.length === 0) {
        return <div className={styles.Empty}>{emptyText}</div>;
    }

    return (
        <div className={styles.List}>
            {target.map(({ value, element }) =>
                React.cloneElement(element, {
                    key: element.key ?? value,
                })
            )}
        </div>
    );
};

type ContentBodyProps = {
    dropdownProps: Omit<React.ComponentProps<typeof Dropdown.Content>, 'children'>;
    contentClassName: string;
    handleMouseDown: React.MouseEventHandler<HTMLDivElement>;
    searchable: boolean;
    searchPlaceholder: string;
    emptyText: string;
    options: OptionNode[];
    createOption?: React.ReactNode;
};

const ContentBody: React.FC<ContentBodyProps> = ({
    dropdownProps,
    contentClassName,
    handleMouseDown,
    searchable,
    searchPlaceholder,
    emptyText,
    options,
    createOption,
}) => {
    const { query, setQuery } = useQuerySearch<{ uuid: string; label: string }>();

    return (
        <Dropdown.Content {...dropdownProps} className={contentClassName} onMouseDown={handleMouseDown}>
            {searchable ? (
                <div className={styles.SearchRow} data-allow-focus="true">
                    <SearchInput
                        fullWidth
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={searchPlaceholder}
                        name="multiselect-search"
                    />
                </div>
            ) : null}

            <ChipMultiSelectList options={options} searchable={searchable} emptyText={emptyText} />

            {createOption ? <div className={styles.CreateOption}>{createOption}</div> : null}
        </Dropdown.Content>
    );
};

const ChipMultiSelectContent: React.FC<ChipMultiSelectContentProps> = (props) => {
    const {
        className,
        children,
        searchable = true,
        searchPlaceholder = '검색어를 입력하세요',
        emptyText = '검색 결과가 없어요',
        ...rest
    } = props;
    const { createOption } = useChipMultiSelectConfig();

    const contentClassName = classNames(styles.Content, className);

    const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
        const target = e.target as HTMLElement;
        const isInputArea = target.tagName === 'INPUT' || target.closest('[data-allow-focus="true"]');
        if (isInputArea) return;
        // ✅ blur로 닫히는 Dropdown이면 이 한 줄로 “선택해도 안 닫힘”
        e.preventDefault();
    };

    const options = useOptionNodes(children);

    return (
        <ContentBody
            dropdownProps={rest}
            contentClassName={contentClassName}
            handleMouseDown={handleMouseDown}
            searchable={searchable}
            searchPlaceholder={searchPlaceholder}
            emptyText={emptyText}
            options={options}
            createOption={createOption}
        />
    );
};

export default ChipMultiSelectContent;
