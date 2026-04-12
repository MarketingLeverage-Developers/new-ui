import MemberProfileAvatar from '@/components/common/MemberProfileAvatar/MemberProfileAvatar';
import { getFallbackUserProfileSrc } from '@/shared/utils/profile/getFallbackUserProfileSrc';
import toProfileShortName from '@/shared/utils/profile/toProfileShortName';
import styles from './MemberSelectOptionLabel.module.scss';

type MemberSelectOptionLabelProps = {
    name: string;
    src?: string | null;
    useShortNameAvatar?: boolean;
    useShortNameAvatarWhenProfileMissing?: boolean;
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

const MemberSelectOptionLabel = ({
    name,
    src,
    useShortNameAvatar = false,
    useShortNameAvatarWhenProfileMissing = false,
}: MemberSelectOptionLabelProps) => {
    const normalizedSrc = src?.trim() ?? '';
    const hasProfileSrc = normalizedSrc.length > 0;
    const shouldUseShortNameAvatar =
        useShortNameAvatar || (useShortNameAvatarWhenProfileMissing && !hasProfileSrc);
    const resolvedSrc = useShortNameAvatar
        ? undefined
        : useShortNameAvatarWhenProfileMissing
          ? hasProfileSrc
              ? normalizedSrc
              : undefined
          : resolveUserAvatarSrc(name, normalizedSrc);

    return (
        <span className={styles.Root}>
            <MemberProfileAvatar
                className={styles.Avatar}
                name={name}
                src={resolvedSrc}
                fallbackText={shouldUseShortNameAvatar ? toProfileShortName(name) : undefined}
                size={22}
                fontSize={10}
                style={shouldUseShortNameAvatar ? shortNameAvatarStyle : undefined}
            />
            <span className={styles.Name}>{name}</span>
        </span>
    );
};

export default MemberSelectOptionLabel;
