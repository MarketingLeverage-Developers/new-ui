import { getFallbackUserProfileSrc } from '@/shared/utils/profile/getFallbackUserProfileSrc';
import toProfileShortName from '@/shared/utils/profile/toProfileShortName';
import React, { useMemo } from 'react';
import SectionFieldVisualSelect from '../SectionFieldVisualSelect/SectionFieldVisualSelect';

const noop = () => undefined;

export type SectionFieldMemberSelectOption<T extends string = string> = {
    value: T;
    label: string;
    profileImageUrl?: string | null;
    disabled?: boolean;
    searchText?: string;
};

const resolveUserAvatarSrc = <T extends string>(option: SectionFieldMemberSelectOption<T>) => {
    const profileImageUrl = option.profileImageUrl?.trim();

    if (profileImageUrl && profileImageUrl.length > 0) {
        return profileImageUrl;
    }

    return getFallbackUserProfileSrc(option.value || option.label);
};

type SectionFieldMemberSelectCommonProps<T extends string = string> = {
    options: SectionFieldMemberSelectOption<T>[];
    useShortNameAvatar?: boolean;
    useShortNameAvatarWhenProfileMissing?: boolean;
    className?: string;
    menuClassName?: string;
    disabled?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    searchEmptyText?: React.ReactNode;
    emptyLabel?: React.ReactNode;
    clearable?: boolean;
    clearLabel?: React.ReactNode;
    menuMaxHeight?: number | string;
    menuMinWidth?: number | string;
};

type SectionFieldMemberSelectSingleProps<T extends string = string> = SectionFieldMemberSelectCommonProps<T> & {
    multiple?: false;
    value?: T;
    defaultValue?: T;
    onChange?: (nextValue: T) => void;
    clearValue?: T;
};

type SectionFieldMemberSelectMultipleProps<T extends string = string> = SectionFieldMemberSelectCommonProps<T> & {
    multiple: true;
    values?: T[];
    defaultValues?: T[];
    onValuesChange?: (nextValues: T[]) => void;
    maxVisibleAvatars?: number;
};

export type SectionFieldMemberSelectProps<T extends string = string> =
    | SectionFieldMemberSelectSingleProps<T>
    | SectionFieldMemberSelectMultipleProps<T>;

const isMultipleProps = <T extends string>(
    props: SectionFieldMemberSelectProps<T>
): props is SectionFieldMemberSelectMultipleProps<T> => props.multiple === true;

const SectionFieldMemberSelect = <T extends string = string>(props: SectionFieldMemberSelectProps<T>) => {
    const visualOptions = useMemo(
        () =>
            props.options.map((option) => {
                const normalizedProfileImageUrl = option.profileImageUrl?.trim() ?? '';
                const hasProfileImage = normalizedProfileImageUrl.length > 0;
                const shouldUseShortNameAvatar =
                    props.useShortNameAvatar ||
                    (props.useShortNameAvatarWhenProfileMissing && !hasProfileImage);

                return {
                    value: option.value,
                    label: option.label,
                    imageSrc: props.useShortNameAvatar
                        ? undefined
                        : props.useShortNameAvatarWhenProfileMissing
                          ? hasProfileImage
                              ? normalizedProfileImageUrl
                              : undefined
                          : resolveUserAvatarSrc(option),
                    imageAlt: `${option.label} profile`,
                    visualText: shouldUseShortNameAvatar ? toProfileShortName(option.label) : undefined,
                    disabled: option.disabled,
                    searchText: option.searchText,
                };
            }),
        [props.options, props.useShortNameAvatar, props.useShortNameAvatarWhenProfileMissing]
    );

    if (isMultipleProps(props)) {
        return (
            <SectionFieldVisualSelect
                multiple
                values={props.values}
                defaultValues={props.defaultValues}
                onValuesChange={props.onValuesChange ?? noop}
                options={visualOptions}
                className={props.className}
                menuClassName={props.menuClassName}
                disabled={props.disabled}
                searchable={props.searchable}
                searchPlaceholder={props.searchPlaceholder ?? '이름으로 검색'}
                searchEmptyText={props.searchEmptyText ?? '선택 가능한 담당자가 없습니다.'}
                emptyLabel={props.emptyLabel ?? '담당자 추가'}
                clearable={props.clearable}
                clearLabel={props.clearLabel ?? '전체 해제'}
                menuMaxHeight={props.menuMaxHeight}
                menuMinWidth={props.menuMinWidth}
                maxVisibleVisuals={props.maxVisibleAvatars}
                selectedSectionLabel="선택된 담당자"
                selectionUnitLabel="명"
                getSelectedItemLabel={(option, index) => `${option.label}${index === 0 ? ' · 주 담당자' : ''}`}
            />
        );
    }

    const singleProps = props as SectionFieldMemberSelectSingleProps<T>;

    return (
        <SectionFieldVisualSelect
            value={singleProps.value}
            defaultValue={singleProps.defaultValue}
            onChange={singleProps.onChange ?? noop}
            clearValue={singleProps.clearValue}
            options={visualOptions}
            className={singleProps.className}
            menuClassName={singleProps.menuClassName}
            disabled={singleProps.disabled}
            searchable={singleProps.searchable}
            searchPlaceholder={singleProps.searchPlaceholder ?? '이름으로 검색'}
            searchEmptyText={singleProps.searchEmptyText ?? '선택 가능한 담당자가 없습니다.'}
            emptyLabel={singleProps.emptyLabel ?? '담당자 추가'}
            clearable={singleProps.clearable}
            clearLabel={singleProps.clearLabel ?? '선택 안함'}
            menuMaxHeight={singleProps.menuMaxHeight}
            menuMinWidth={singleProps.menuMinWidth}
            selectedSectionLabel="선택된 담당자"
            selectionUnitLabel="명"
        />
    );
};

export default SectionFieldMemberSelect;
