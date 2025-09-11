import Text from '@/shared/primitives/Text/Text';
import styles from './HoverButton.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';
import type { HexColor } from '@/shared/types/css/HexColor';
import type { ThemeColorVar } from '@/shared/types/css/ThemeColorTokens';

type HoverButtonProps = {
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    width?: string | number;
    padding?: PaddingSize | number;
    textColor?: HexColor | ThemeColorVar;
    style?: React.CSSProperties;
    children: React.ReactNode;
};

const HoverButton = ({ onClick, width, padding, textColor, children, style, ...props }: HoverButtonProps) => {
    const cssVariables: CSSVariables = {
        '--width': toCssUnit(width),
        '--padding': toCssPadding(padding),
        '--textColor': textColor,
    };
    return (
        <button className={styles.HoverButton} onClick={onClick} style={{ ...style, ...cssVariables }} {...props}>
            <Text fontSize={13} fontWeight={500}>
                {children}
            </Text>
        </button>
    );
};

export default HoverButton;
