import styles from './HoverButton.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';

type HoverButtonProps = {
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    width?: string | number;
    padding?: PaddingSize | number;
    style?: React.CSSProperties;
    children: React.ReactNode;
};

const HoverButton = ({ onClick, width, padding, children, style, ...props }: HoverButtonProps) => {
    const cssVariables: CSSVariables = {
        '--width': toCssUnit(width),
        '--padding': toCssPadding(padding),
    };
    return (
        <button className={styles.HoverButton} onClick={onClick} style={{ ...style, ...cssVariables }} {...props}>
            <span>{children}</span>
        </button>
    );
};

export default HoverButton;
