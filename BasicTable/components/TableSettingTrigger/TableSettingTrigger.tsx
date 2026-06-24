import BaseButton from '../../../BaseButton/BaseButton';
import tableStyles from '../../BasicTable.module.scss';
// import { FaCog } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';

const TableSettingTrigger = ({ open, onToggle }: { open: boolean; onToggle: () => void }) => (
    <BaseButton
        type="button"
        className={tableStyles.Trigger} // ✅ 이 Trigger도 BasicTable.module.scss로 옮길 수 있음(원하면)
        // padding={{ x: 12, y: 8 }}
        bgColor="var(--granter-white)"
        textColor={open ? 'var(--granter-sky-600)' : 'var(--granter-gray-500)'}
        style={{ border: '1px solid var(--granter-gray-200)' }}
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
