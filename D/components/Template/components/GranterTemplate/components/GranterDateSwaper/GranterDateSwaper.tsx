import React from 'react';
import GranterDateSwaperWithPanel, {
    type GranterDatePreset,
} from '../GranterDateSwaperWithPanel/GranterDateSwaperWithPanel';
import styles from './GranterDateSwaper.module.scss';

export type GranterDateSwaperProps = {
    dateRangeLabel: React.ReactNode;
    isDefault?: boolean;
    datePresets?: GranterDatePreset[];
    monthPresets?: GranterDatePreset[];
    onPrevClick?: () => void;
    onNextClick?: () => void;
    onPresetClick?: (presetKey: string) => void;
    onMonthPresetClick?: (presetKey: string) => void;
};

const GranterDateSwaper = ({
    dateRangeLabel,
    isDefault = true,
    datePresets,
    monthPresets,
    onPrevClick,
    onNextClick,
    onPresetClick,
    onMonthPresetClick,
}: GranterDateSwaperProps) => (
    <div className={styles.Wrap}>
        <GranterDateSwaperWithPanel
            dateRangeLabel={dateRangeLabel}
            isDefault={isDefault}
            showArrows
            leftPresets={datePresets}
            rightPresets={monthPresets}
            onPrevClick={onPrevClick}
            onNextClick={onNextClick}
            onPresetClick={onPresetClick}
            onMonthPresetClick={onMonthPresetClick}
        />
    </div>
);

export default GranterDateSwaper;
