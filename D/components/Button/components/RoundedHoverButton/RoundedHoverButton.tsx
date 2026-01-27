import styles from './RoundedHoverButton.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import { toCssPadding } from '@/shared/utils/css/toCssPadding';
import type { PaddingSize } from '@/shared/types/css/PaddingSize';

export type RoundedHoverButtonProps = {
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    width?: string | number;
    padding?: PaddingSize | number;
    style?: React.CSSProperties;
    children: React.ReactNode;
};

const RoundedHoverButton = React.forwardRef<HTMLButtonElement, RoundedHoverButtonProps>(
    ({ onClick, width, padding, children, style, ...props }, ref) => {
        const cssVariables: CSSVariables = {
            '--width': toCssUnit(width),
            '--padding': toCssPadding(padding),
        };
        return (
            <button
                ref={ref}
                className={styles.RoundedHoverButton}
                onClick={onClick}
                style={{ ...style, ...cssVariables }}
                {...props}
            >
                <span>{children}</span>
            </button>
        );
    }
);

RoundedHoverButton.displayName = 'RoundedHoverButton';

export default RoundedHoverButton;
