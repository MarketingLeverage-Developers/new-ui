import MemberProfileAvatar from '@/components/common/MemberProfileAvatar/MemberProfileAvatar';
import { getFallbackUserProfileSrc } from '@/shared/utils/profile/getFallbackUserProfileSrc';
import toProfileShortName from '@/shared/utils/profile/toProfileShortName';
import styles from './MemberSelectOptionLabel.module.scss';

type MemberSelectOptionLabelProps = {
    name: string;
    src?: string | null;
    useShortNameAvatar?: boolean;
};

const resolveUserAvatarSrc = (name: string, src?: string | null) => {
    const profileImageUrl = src?.trim();

    if (profileImageUrl && profileImageUrl.length > 0) {
        return profileImageUrl;
    }

    return getFallbackUserProfileSrc(name);
};

const shortNameAvatarStyle = {
    boxSizing: 'border-box',
    boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.2)',
};

const MemberSelectOptionLabel = ({ name, src, useShortNameAvatar = false }: MemberSelectOptionLabelProps) => (
    <span className={styles.Root}>
        <MemberProfileAvatar
            className={styles.Avatar}
            name={name}
            src={useShortNameAvatar ? undefined : resolveUserAvatarSrc(name, src)}
            fallbackText={useShortNameAvatar ? toProfileShortName(name) : undefined}
            size={22}
            fontSize={10}
            style={useShortNameAvatar ? shortNameAvatarStyle : undefined}
        />
        <span className={styles.Name}>{name}</span>
    </span>
);

export default MemberSelectOptionLabel;
