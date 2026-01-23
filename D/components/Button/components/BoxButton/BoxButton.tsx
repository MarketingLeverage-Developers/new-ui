import React, { forwardRef } from 'react';
import classNames from 'classnames';
import styles from './BoxButton.module.scss';
import { MdKeyboardArrowRight, MdClose } from 'react-icons/md';
import { Common } from '@/shared/primitives/C/Common';

export type BoxButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;

    /** ✅ 버튼 전체를 덮는 이미지 */
    imageSrc?: string;
    imageAlt?: string;

    /** ✅ 왼쪽 상단 제거 버튼 보이기/숨기기 (상세에서 false) */
    showRemove?: boolean;

    /** ✅ 제거 버튼 클릭 콜백 */
    onRemove?: () => void;
};

const BoxButton = forwardRef<HTMLButtonElement, BoxButtonProps>((props, ref) => {
    const {
        className,
        type = 'button',
        children,

        imageSrc,
        imageAlt,

        showRemove = false,
        onRemove,

        disabled,
        ...rest
    } = props;

    const rootClassName = classNames(styles.BoxButton, className);
    const apiPrefix = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : undefined;

    const handleRemoveClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        // ✅ 버튼 클릭으로 이벤트 퍼지는거 차단
        e.preventDefault();
        e.stopPropagation();
        onRemove?.();
    };

    const hasImage = !!imageSrc;

    return (
        <button ref={ref} type={type} className={rootClassName} disabled={disabled} {...rest}>
            {hasImage ? (
                <Common.Image
                    className={styles.Image}
                    src={imageSrc}
                    prefix={apiPrefix}
                    alt={imageAlt ?? ''}
                    width="100%"
                    height="100%"
                    fit="cover"
                    block
                />
            ) : null}

            {showRemove && hasImage && !disabled ? (
                <button type="button" className={styles.RemoveButton} onClick={handleRemoveClick} aria-label="remove">
                    <MdClose className={styles.RemoveIcon} aria-hidden />
                </button>
            ) : null}

            {/* ✅ 이미지가 있으면 텍스트/동그라미(chevron) 전부 숨김(렌더 자체 X) */}
            {!hasImage ? (
                <>
                    <span className={styles.Text}>{children}</span>

                    <span className={styles.Circle} aria-hidden>
                        <MdKeyboardArrowRight className={styles.Icon} />
                    </span>
                </>
            ) : null}
        </button>
    );
});

BoxButton.displayName = 'BoxButton';

export default BoxButton;
