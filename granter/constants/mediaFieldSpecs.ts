type FieldKey =
    | 'customerId'
    | 'accountId'
    | 'accountPassword'
    | 'secretKey'
    | 'accessToken'
    | 'refreshToken'
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
        { key: 'accountId', label: '광고주계정', placeholder: '계정을 입력해주세요.', required: true },
        {
            key: 'accountPassword',
            label: '광고주계정 비밀번호',
            placeholder: '비밀번호를 입력해주세요.',
            required: true,
        },
        { key: 'customerId', label: 'CUSTOMER_ID', placeholder: '키값을 입력해주세요.', required: true },
        { key: 'secretKey', label: '시크릿키', placeholder: '키값을 입력해주세요.', required: false },
    ],
    카카오: [
        { key: 'accountId', label: '광고주계정', placeholder: '계정을 입력해주세요.', required: true },
        {
            key: 'accountPassword',
            label: '광고주계정 비밀번호',
            placeholder: '비밀번호를 입력해주세요.',
            required: true,
        },
        { key: 'customerId', label: 'CUSTOMER_ID', placeholder: '키값을 입력해주세요.', required: true },
        { key: 'secretKey', label: '시크릿키', placeholder: '키값을 입력해주세요.', required: false },
    ],
    네이버: [
        { key: 'accountId', label: '광고주계정', placeholder: '계정을 입력해주세요.', required: true },
        {
            key: 'accountPassword',
            label: '광고주계정 비밀번호',
            placeholder: '비밀번호를 입력해주세요.',
            required: true,
        },
        { key: 'customerId', label: 'CUSTOMER_ID', placeholder: '키값을 입력해주세요.', required: true },
        { key: 'secretKey', label: '시크릿키', placeholder: '키값을 입력해주세요.', required: false },
        {
            key: 'accessToken',
            label: '액세스라이선스(또는 토큰)',
            placeholder: '키값을 입력해주세요.',
            required: false,
        },
    ],
    메타: [
        { key: 'accountId', label: '광고주계정', placeholder: '계정을 입력해주세요.', required: false },
        {
            key: 'accountPassword',
            label: '광고주계정 비밀번호',
            placeholder: '비밀번호를 입력해주세요.',
            required: false,
        },
        { key: 'customerId', label: 'CUSTOMER_ID', placeholder: '키값을 입력해주세요.', required: true },
        { key: 'secretKey', label: '시크릿키', placeholder: '키값을 입력해주세요.', required: false },
        { key: 'accessToken', label: 'ACCESS_TOKEN', placeholder: '키값을 입력해주세요.', required: false },
    ],
    당근: [
        { key: 'accountId', label: '광고주계정', placeholder: '계정을 입력해주세요.', required: false },
        {
            key: 'accountPassword',
            label: '광고주계정 비밀번호',
            placeholder: '비밀번호를 입력해주세요.',
            required: false,
        },
        { key: 'monthBudget', label: '월 소진액', placeholder: '금액 입력해주세요', required: false },
    ],
};
