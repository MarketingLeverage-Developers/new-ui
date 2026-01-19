import React from 'react';
import classNames from 'classnames';
import styles from './ModalTemplate.module.scss';

import type { CSSLength } from '@/shared/types';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';

import ModalTemplateHeader, {
    type ModalTemplateHeaderProps,
} from './components/ModalTemplateHeader/ModalTemplateHeader';
import ModalTemplateMain, { type ModalTemplateMainProps } from './components/ModalTemplateMain/ModalTemplateMain';

export type ModalTemplateExtraProps = {
    className?: string;
};

export type ModalTemplateProps = ModalTemplateExtraProps & {
    /** ✅ module.scss에서 width 제어용 */
    width?: CSSLength;

    title?: string;
    subTitle?: string;
    onTitleChange?: (title: string) => void;
    main?: React.ReactNode;

    headerClassName?: string;
    mainClassName?: string;
};

type ModalTemplateCompound = React.FC<ModalTemplateProps> & {
    Header: React.FC<ModalTemplateHeaderProps>;
    Main: React.FC<ModalTemplateMainProps>;
};

const ModalTemplateRoot: React.FC<ModalTemplateProps> = (props) => {
    const { className, width, title, subTitle, onTitleChange, main, mainClassName } = props;

    const cssVariables: CSSVariables = {
        '--modal-width': toCssUnit(width),
    };

    const rootClassName = classNames(styles.ModalTemplate, className);

    return (
        <div className={rootClassName} style={cssVariables}>
            {title ? <ModalTemplateHeader title={title} subTitle={subTitle} onTitleChange={onTitleChange} /> : null}
            {main ? <ModalTemplateMain className={mainClassName}>{main}</ModalTemplateMain> : null}
        </div>
    );
};

const ModalTemplate = Object.assign(ModalTemplateRoot, {
    Header: ModalTemplateHeader,
    Main: ModalTemplateMain,
}) as ModalTemplateCompound;

export default ModalTemplate;
