import RoundedSelect from '@/shared/primitives/RoundedSelect/RoundedSelect';
type Props = {
    size: number;
    onClick: () => void;
};

export const PageSizeSelect = ({ size, onClick }: Props) => (
    <RoundedSelect value={String(size)}>
        <RoundedSelect.Display
            render={() => <>{size}개씩 보기</>}
            onClick={() => {
                onClick();
            }}
        />
        {/* <RoundedSelect.Content>
            <RoundedSelect.Item value="20">20개 씩 보기</RoundedSelect.Item>
            <RoundedSelect.Item value="50">50개 씩 보기</RoundedSelect.Item>
            <RoundedSelect.Item value="100">100개 씩 보기</RoundedSelect.Item>
        </RoundedSelect.Content> */}
    </RoundedSelect>
);
