import type { SectionFieldSelectOption } from '@/components/common/granter';
import MemberSelectOptionLabel from './MemberSelectOptionLabel';

type MemberSelectOptionLike<T extends string = string> = {
    value: T;
    label: string;
    profileImageUrl?: string | null;
    searchText?: string;
    disabled?: boolean;
};

export const toMemberSelectOption = <T extends string, TOption extends MemberSelectOptionLike<T>>(
    option: TOption
): SectionFieldSelectOption<T> => ({
    value: option.value,
    label: <MemberSelectOptionLabel name={option.label} src={option.profileImageUrl} />,
    searchText: option.searchText ?? option.label,
    disabled: option.disabled,
});

export const toMemberSelectOptions = <T extends string, TOption extends MemberSelectOptionLike<T>>(
    options: TOption[]
): SectionFieldSelectOption<T>[] => options.map(toMemberSelectOption);
