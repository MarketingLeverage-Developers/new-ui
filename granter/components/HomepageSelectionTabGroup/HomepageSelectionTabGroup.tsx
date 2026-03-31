import classNames from 'classnames';
import { FiGlobe } from 'react-icons/fi';
import styles from './HomepageSelectionTabGroup.module.scss';

export type HomepageSelectionTabGroupTone = 'green' | 'orange' | 'purple' | 'teal' | 'gray';

export type HomepageSelectionTabGroupItem = {
    id: string;
    label: string;
    title?: string;
    tone?: HomepageSelectionTabGroupTone;
};

export type HomepageSelectionTabGroupProps = {
    items: HomepageSelectionTabGroupItem[];
    value: string;
    onChange: (id: string) => void;
    className?: string;
};

const RANDOM_TONES: HomepageSelectionTabGroupTone[] = ['green', 'orange', 'purple', 'teal'];

const getRandomTone = (seed: string): HomepageSelectionTabGroupTone => {
    if (!seed.trim()) return 'gray';

    let hash = 0;
    for (let index = 0; index < seed.length; index += 1) {
        hash = seed.charCodeAt(index) + ((hash << 5) - hash);
        hash |= 0;
    }

    return RANDOM_TONES[Math.abs(hash) % RANDOM_TONES.length] ?? 'gray';
};

const HomepageSelectionTabGroup = ({
    items,
    value,
    onChange,
    className,
}: HomepageSelectionTabGroupProps) => (
    <div className={classNames(styles.Root, className)} role="tablist" aria-label="홈페이지 선택">
        {items.map((item) => {
            const isSelected = item.id === value;

            return (
                <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={styles.Item}
                    data-tone={item.tone ?? getRandomTone(item.id)}
                    data-selected={isSelected}
                    onClick={() => onChange(item.id)}
                    aria-label={`${item.title ?? item.label} 홈페이지 선택`}
                    title={item.title ?? item.label}
                >
                    <span className={styles.Icon} aria-hidden="true">
                        <FiGlobe size={15} />
                    </span>
                    <span className={styles.Label}>{item.label}</span>
                </button>
            );
        })}
    </div>
);

export default HomepageSelectionTabGroup;
