import MemberProfileAvatar from '@/components/common/MemberProfileAvatar/MemberProfileAvatar';
import styles from './MemberSelectOptionLabel.module.scss';

type MemberSelectOptionLabelProps = {
    name: string;
    src?: string | null;
};

const MemberSelectOptionLabel = ({ name, src }: MemberSelectOptionLabelProps) => (
    <span className={styles.Root}>
        <MemberProfileAvatar className={styles.Avatar} name={name} src={src} size={22} fontSize={10} />
        <span className={styles.Name}>{name}</span>
    </span>
);

export default MemberSelectOptionLabel;
