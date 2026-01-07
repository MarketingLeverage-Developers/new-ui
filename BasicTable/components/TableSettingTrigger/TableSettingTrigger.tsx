import BaseButton from '@/shared/primitives/BaseButton/BaseButton';
import tableStyles from '../../BasicTable.module.scss';
import { getThemeColor } from '@/shared/utils/css/getThemeColor';
import { FaCog } from 'react-icons/fa';

const TableSettingTrigger = ({ open, onToggle }: { open: boolean; onToggle: () => void }) => (
    <BaseButton
        type="button"
        className={tableStyles.Trigger} // ✅ 이 Trigger도 BasicTable.module.scss로 옮길 수 있음(원하면)
        padding={{ x: 12, y: 8 }}
        bgColor={getThemeColor('Gray6')}
        textColor={getThemeColor('Gray1')}
        radius={8}
        height={34}
        fontSize={18}
        onClick={onToggle}
    >
        <FaCog />
    </BaseButton>
);

export default TableSettingTrigger;
