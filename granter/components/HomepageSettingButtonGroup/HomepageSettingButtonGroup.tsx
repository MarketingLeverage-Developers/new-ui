import classNames from 'classnames';
import { FiGlobe } from 'react-icons/fi';
import { HiOutlinePlus } from 'react-icons/hi2';
import styles from './HomepageSettingButtonGroup.module.scss';

export type HomepageSettingButtonGroupTone = 'green' | 'orange' | 'purple' | 'teal' | 'gray';

export type HomepageSettingButtonGroupItem = {
    id: string;
    label: string;
    title?: string;
    tone?: HomepageSettingButtonGroupTone;
};

export type HomepageSettingButtonGroupProps = {
    items: HomepageSettingButtonGroupItem[];
    onAdd: () => void;
    onSelect: (id: string) => void;
    className?: string;
    addAriaLabel?: string;
};

const RANDOM_TONES: HomepageSettingButtonGroupTone[] = ['green', 'orange', 'purple', 'teal'];

const getRandomTone = (seed: string): HomepageSettingButtonGroupTone => {
    if (!seed.trim()) return 'gray';

    let hash = 0;
    for (let index = 0; index < seed.length; index += 1) {
        hash = seed.charCodeAt(index) + ((hash << 5) - hash);
        hash |= 0;
    }

    return RANDOM_TONES[Math.abs(hash) % RANDOM_TONES.length] ?? 'gray';
};

const HomepageSettingButtonGroup = ({
    items,
    onAdd,
    onSelect,
    className,
    addAriaLabel = '홈페이지 추가',
}: HomepageSettingButtonGroupProps) => (
    <div className={classNames(styles.Root, className)}>
        <button type="button" className={styles.AddButton} onClick={onAdd} aria-label={addAriaLabel}>
            <HiOutlinePlus size={18} />
        </button>
        {items.map((item) => (
            <button
                key={item.id}
                type="button"
                className={styles.Item}
                data-tone={item.tone ?? getRandomTone(item.id)}
                onClick={() => onSelect(item.id)}
                aria-label={`${item.title ?? item.label} 홈페이지 수정`}
                title={item.title ?? item.label}
            >
                <span className={styles.Icon} aria-hidden="true">
                    <FiGlobe size={15} />
                </span>
                <span className={styles.Label}>{item.label}</span>
            </button>
        ))}
    </div>
);

export default HomepageSettingButtonGroup;
