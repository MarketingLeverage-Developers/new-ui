import React from 'react';
import styles from './GranterWorkspaceInfo.module.scss';
import Logo from '../../../../../../../shared/assets/components/D/components/Template/components/PageTemplate/components/LogoLine/logo.svg';

const DEFAULT_LOGO_ALT = '로고';
const DEFAULT_LOGO_TEXT = '마케팅레버리지';

export type GranterWorkspaceInfoProps = {
    imageSrc?: string;
    imageAlt?: string;
    title: React.ReactNode;
    meta?: React.ReactNode;
    onClick?: () => void;
    showToggle?: boolean;
    onToggleClick?: () => void;
};

const GranterWorkspaceInfo = ({
    imageSrc = Logo,
    imageAlt = DEFAULT_LOGO_ALT,
    title,
    meta,
    onClick,
    showToggle,
    onToggleClick,
}: GranterWorkspaceInfoProps) => (
    <div className={styles.Wrap}>
        <button type="button" className={styles.MainButton} onClick={onClick}>
            {/* {avatar ? <span className={styles.Avatar}>{avatar}</span> : null} */}
            <img className={styles.Avatar} src={imageSrc} alt={imageAlt} />
            <span className={styles.Copy}>
                <span className={styles.Title}>{title}</span>
                {meta ? <span className={styles.Meta}>{meta}</span> : null}
            </span>
        </button>

        {showToggle ? (
            <button type="button" className={styles.ToggleButton} onClick={onToggleClick}>
                ‹
            </button>
        ) : null}
    </div>
);

export default GranterWorkspaceInfo;
