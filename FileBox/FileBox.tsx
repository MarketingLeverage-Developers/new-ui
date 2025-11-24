import React, { type HTMLAttributes } from 'react';
import styles from './FileBox.module.scss';
import type { CSSVariables } from '@/shared/types/css/CSSVariables';
import { toCssUnit } from '@/shared/utils';
import type { CSSLength } from '@/shared/types';
import { IoMdCloseCircle } from 'react-icons/io';

type Props = {
    file: any;
    width?: CSSLength;
    onDeleteClick?: () => void;
} & HTMLAttributes<HTMLDivElement>;
const FileBox = ({ file, width, onDeleteClick }: Props) => {
    const cssVariables: CSSVariables = {
        '--width': toCssUnit(width),
    };
    return (
        <>
            {file && file.fileUUID && (
                <div className={styles.FileBox} style={{ ...cssVariables }}>
                    <span>{file.originalFileName}</span>
                    {onDeleteClick && (
                        <IoMdCloseCircle
                            className={styles.Delete}
                            onClick={(e) => {
                                e.stopPropagation();
                                onDeleteClick();
                            }}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default FileBox;
