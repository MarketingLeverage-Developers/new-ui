import styles from './RoundedHoverButton.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';

type RoundedHoverButtonProps = {
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    width?: string | number;
    padding?: PaddingSize | number;
    style?: React.CSSProperties;
    children: React.ReactNode;
};

const RoundedHoverButton = ({ onClick, width, padding, children, style, ...props }: RoundedHoverButtonProps) => {
    const cssVariables: CSSVariables = {
        '--width': toCssUnit(width),
        '--padding': toCssPadding(padding),
    };
    return (
        <button
            className={styles.RoundedHoverButton}
            onClick={onClick}
            style={{ ...style, ...cssVariables }}
            {...props}
        >
            <span>{children}</span>
        </button>
    );
};

export default RoundedHoverButton;
