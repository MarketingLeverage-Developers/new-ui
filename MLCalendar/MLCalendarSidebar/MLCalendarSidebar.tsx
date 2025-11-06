import CheckboxGroup from '@/shared/primitives/CheckboxGroup/CheckboxGroup';
import Flex from '@/shared/primitives/Flex/Flex';

export type FilterId =
    | 'default'
    | 'mk_meeting'
    | 'ct_schedule'
    | 'ct_website'
    | 'ct_request'
    | 'dev_website'
    | 'dev_request'
    | 'co_birthday'
    | 'co_holiday'
    | 'co_company'
    | 'co_interview';

type Props = {
    value: FilterId[]; // 현재 체크된 id 목록
    onChange: (next: FilterId[]) => void; // 변경 핸들러
};

export default function CalendarSidebar({ value, onChange }: Props) {
    return (
        <CheckboxGroup value={value} onChange={(ids) => onChange(ids as FilterId[])}>
            {/* 마케팅팀 */}
            <Flex direction="column" gap={36}>
                <CheckboxGroup.Category
                    id="marketing"
                    title="마케팅팀"
                    bgColor="#FFE7E5"
                    color="#C22012"
                    padding={{ y: 4, l: 32 }}
                >
                    <Flex direction="column" gap={8}>
                        <CheckboxGroup.Item value="mk_meeting" bgColor="#E2E2E2" borderColor="#E2E2E2">
                            미팅
                        </CheckboxGroup.Item>
                    </Flex>
                </CheckboxGroup.Category>

                {/* 컨텐츠팀 */}
                <CheckboxGroup.Category
                    id="contents"
                    title="컨텐츠팀"
                    bgColor="#FFF6B2"
                    color="#BD7018"
                    padding={{ y: 4, l: 32 }}
                >
                    <Flex direction="column" gap={8}>
                        <CheckboxGroup.Item value="ct_schedule" bgColor="#E2E2E2" borderColor="#E2E2E2">
                            스케줄
                        </CheckboxGroup.Item>
                        <CheckboxGroup.Item value="ct_website" bgColor="#E2E2E2" borderColor="#E2E2E2">
                            웹사이트
                        </CheckboxGroup.Item>
                        <CheckboxGroup.Item value="ct_request" bgColor="#E2E2E2" borderColor="#E2E2E2">
                            개발요청
                        </CheckboxGroup.Item>
                    </Flex>
                </CheckboxGroup.Category>

                {/* 개발팀 */}
                <CheckboxGroup.Category
                    id="dev"
                    title="개발팀"
                    bgColor="#C5E0FF"
                    color="#1979F8"
                    padding={{ y: 4, l: 32 }}
                >
                    <Flex direction="column" gap={8}>
                        <CheckboxGroup.Item value="dev_website" bgColor="#E2E2E2" borderColor="#E2E2E2">
                            웹사이트
                        </CheckboxGroup.Item>
                        <CheckboxGroup.Item value="dev_request" bgColor="#E2E2E2" borderColor="#E2E2E2">
                            개발요청
                        </CheckboxGroup.Item>
                    </Flex>
                </CheckboxGroup.Category>

                {/* 회사일정 */}
                <CheckboxGroup.Category
                    id="company"
                    title="회사일정"
                    bgColor="#FFD4AE"
                    color="#E06A02"
                    padding={{ y: 4, l: 32 }}
                >
                    <Flex direction="column" gap={8}>
                        <CheckboxGroup.Item value="co_birthday" bgColor="#E2E2E2" borderColor="#E2E2E2">
                            생일
                        </CheckboxGroup.Item>
                        <CheckboxGroup.Item value="co_holiday" bgColor="#E2E2E2" borderColor="#E2E2E2">
                            휴가
                        </CheckboxGroup.Item>
                        <CheckboxGroup.Item value="co_company" bgColor="#E2E2E2" borderColor="#E2E2E2">
                            기업일정
                        </CheckboxGroup.Item>
                        <CheckboxGroup.Item value="co_interview" bgColor="#E2E2E2" borderColor="#E2E2E2">
                            면접
                        </CheckboxGroup.Item>
                    </Flex>
                </CheckboxGroup.Category>
            </Flex>
        </CheckboxGroup>
    );
}
