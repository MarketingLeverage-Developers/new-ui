type FieldKey =
    | 'customerId'
    | 'accountId'
    | 'accountPassword'
    | 'monthBudget';

type FieldSpec = {
    key: FieldKey;
    label: string;
    placeholder?: string;
    inputType?: 'text' | 'password';
    required?: boolean;
};

export const MEDIA_FIELD_SPECS: Record<string, FieldSpec[]> = {
    구글: [
        { key: 'accountId', label: '광고주계정', placeholder: '계정을 입력해주세요.' },
        { key: 'accountPassword', label: '광고주계정 비밀번호', placeholder: '비밀번호를 입력해주세요.', inputType: 'password' },
        { key: 'customerId', label: 'CUSTOMER_ID', placeholder: '키값을 입력해주세요.' },
    ],
    카카오: [
        { key: 'accountId', label: '광고주계정', placeholder: '계정을 입력해주세요.' },
        { key: 'accountPassword', label: '광고주계정 비밀번호', placeholder: '비밀번호를 입력해주세요.', inputType: 'password' },
        { key: 'customerId', label: 'CUSTOMER_ID', placeholder: '키값을 입력해주세요.' },
    ],
    네이버: [
        { key: 'accountId', label: '광고주계정', placeholder: '계정을 입력해주세요.' },
        { key: 'accountPassword', label: '광고주계정 비밀번호', placeholder: '비밀번호를 입력해주세요.', inputType: 'password' },
        { key: 'customerId', label: 'CUSTOMER_ID', placeholder: '키값을 입력해주세요.' },
    ],
    메타: [
        { key: 'accountId', label: '광고주계정', placeholder: '계정을 입력해주세요.' },
        { key: 'accountPassword', label: '광고주계정 비밀번호', placeholder: '비밀번호를 입력해주세요.', inputType: 'password' },
        { key: 'customerId', label: 'CUSTOMER_ID', placeholder: '키값을 입력해주세요.' },
    ],
    당근: [
        { key: 'accountId', label: '광고주계정', placeholder: '계정을 입력해주세요.' },
        { key: 'accountPassword', label: '광고주계정 비밀번호', placeholder: '비밀번호를 입력해주세요.', inputType: 'password' },
        { key: 'monthBudget', label: '월 소진액', placeholder: '금액 입력해주세요' },
    ],
};
