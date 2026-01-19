import React from 'react';
import FileChip, { type FileChipProps } from './components/FileChip/FileChip';

export type ChipVariant = 'file';

export type ChipProps = { variant: 'file' } & FileChipProps;

const Chip = (props: ChipProps) => {
    const { variant, ...rest } = props;

    if (variant === 'file') {
        return <FileChip {...rest} />;
    }

    return null;
};

export default Chip;
