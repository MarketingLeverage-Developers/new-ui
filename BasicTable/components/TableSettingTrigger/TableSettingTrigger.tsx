import BaseButton from '../../../BaseButton/BaseButton';
import tableStyles from '../../BasicTable.module.scss';
import { getThemeColor } from '../../../shared/utils/css/getThemeColor';
// import { FaCog } from 'react-icons/fa';
import { IoSettingsOutline } from "react-icons/io5";

const TableSettingTrigger = ({ open, onToggle }: { open: boolean; onToggle: () => void }) => (
    <BaseButton
        type="button"
        className={tableStyles.Trigger} // ✅ 이 Trigger도 BasicTable.module.scss로 옮길 수 있음(원하면)
        // padding={{ x: 12, y: 8 }}
        bgColor={getThemeColor('White1')}
        textColor={getThemeColor('Gray1')}
        style={{ border: `1px solid ${getThemeColor('Gray5')}` }}
        radius={8}
        height={40}
        width={40}
        fontSize={18}
        onClick={onToggle}
    >
        {/* <FaCog /> */}
        <IoSettingsOutline />
    </BaseButton>
);

export default TableSettingTrigger;
