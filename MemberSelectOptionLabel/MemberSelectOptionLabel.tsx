import MemberProfileAvatar from '@/components/common/MemberProfileAvatar/MemberProfileAvatar';
import { getFallbackUserProfileSrc } from '@/shared/utils/profile/getFallbackUserProfileSrc';
import styles from './MemberSelectOptionLabel.module.scss';

type MemberSelectOptionLabelProps = {
    name: string;
    src?: string | null;
};

const resolveUserAvatarSrc = (name: string, src?: string | null) => {
    const profileImageUrl = src?.trim();

    if (profileImageUrl && profileImageUrl.length > 0) {
        return profileImageUrl;
    }

    return getFallbackUserProfileSrc(name);
};

const MemberSelectOptionLabel = ({ name, src }: MemberSelectOptionLabelProps) => (
    <span className={styles.Root}>
        <MemberProfileAvatar className={styles.Avatar} name={name} src={resolveUserAvatarSrc(name, src)} size={22} fontSize={10} />
        <span className={styles.Name}>{name}</span>
    </span>
);

export default MemberSelectOptionLabel;
