import React from 'react';
import classNames from 'classnames';
import styles from './ModalTemplate.module.scss';
import type { CSSLength } from '@/shared/types';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import MainOverlay from '@/features/overlay/components/MainOverlay';
import ModalTemplateHeader, {
    type ModalTemplateHeaderProps,
} from './components/ModalTemplateHeader/ModalTemplateHeader';
import ModalTemplateMain, { type ModalTemplateMainProps } from './components/ModalTemplateMain/ModalTemplateMain';

export type ModalTemplateExtraProps = {
    className?: string;
};

export type ModalTemplateProps = ModalTemplateExtraProps & {
    width?: CSSLength;
    isLoading?: boolean;
    isError?: boolean;
    isEmpty?: boolean;
    onRetry?: () => void;
    title?: string;
    subTitle?: string;
    placeholder?: string;
    onTitleChange?: (title: string) => void;
    onClose?: () => void;
    main?: React.ReactNode;
    headerClassName?: string;
    mainClassName?: string;
};

type ModalTemplateCompound = React.FC<ModalTemplateProps> & {
    Header: React.FC<ModalTemplateHeaderProps>;
    Main: React.FC<ModalTemplateMainProps>;
};

const ModalTemplateRoot: React.FC<ModalTemplateProps> = (props) => {
    const {
        className,
        width,
        title,
        subTitle,
        onTitleChange,
        onClose,
        main,
        mainClassName,
        placeholder,
        isLoading,
        isError,
        isEmpty,
        onRetry,
    } = props;

    const cssVariables: CSSVariables = {
        '--modal-width': toCssUnit(width),
    };

    const rootClassName = classNames(styles.ModalTemplate, className);

    return (
        <div className={rootClassName} style={cssVariables}>
            <ModalTemplateHeader
                title={title}
                subTitle={subTitle}
                onTitleChange={onTitleChange}
                placeholder={placeholder}
                onClose={onClose}
            />

            {main ? (
                <ModalTemplateMain className={mainClassName}>
                    <MainOverlay isFetching={isLoading} isEmpty={isEmpty} hasError={isError} onRetry={onRetry}>
                        {main}
                    </MainOverlay>
                </ModalTemplateMain>
            ) : null}
        </div>
    );
};

const ModalTemplate = Object.assign(ModalTemplateRoot, {
    Header: ModalTemplateHeader,
    Main: ModalTemplateMain,
}) as ModalTemplateCompound;

export default ModalTemplate;
