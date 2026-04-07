import type { SectionFieldSelectOption } from '@/components/common/granter';
import MemberSelectOptionLabel from './MemberSelectOptionLabel';

type MemberSelectOptionLike<T extends string = string> = {
    value: T;
    label: string;
    profileImageUrl?: string | null;
    searchText?: string;
    disabled?: boolean;
};

type MemberSelectOptionConfig = {
    useShortNameAvatar?: boolean;
};

export const toMemberSelectOption = <T extends string, TOption extends MemberSelectOptionLike<T>>(
    option: TOption,
    config?: MemberSelectOptionConfig
): SectionFieldSelectOption<T> => ({
    value: option.value,
    label: (
        <MemberSelectOptionLabel
            name={option.label}
            src={option.profileImageUrl}
            useShortNameAvatar={config?.useShortNameAvatar}
        />
    ),
    searchText: option.searchText ?? option.label,
    disabled: option.disabled,
});

export const toMemberSelectOptions = <T extends string, TOption extends MemberSelectOptionLike<T>>(
    options: TOption[],
    config?: MemberSelectOptionConfig
): SectionFieldSelectOption<T>[] => options.map((option) => toMemberSelectOption(option, config));
