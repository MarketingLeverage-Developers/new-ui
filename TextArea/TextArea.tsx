import type { TextareaHTMLAttributes } from 'react';
import styles from './TextArea.module.scss';
import classNames from 'classnames';
import { toCssUnit } from '@/shared/utils';
import type { CSSLength } from '@/shared/types';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';

type BaseTextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>;
type TextAreaAProps = BaseTextAreaProps & {
    height?: CSSLength;
    full?: boolean;
};

const TextArea = ({ height, full, ...props }: TextAreaAProps) => {
    const cssVariables: CSSVariables = {
        '--height': toCssUnit(height),
    };

    const combinedStyles = classNames(styles.TextArea, props.className, {
        [styles.Full]: full,
    });

    return (
        <div className={styles.TextAreaWrapper}>
            <textarea {...props} className={combinedStyles} style={{ ...cssVariables, ...props.style }} />
        </div>
    );
};

export default TextArea;
