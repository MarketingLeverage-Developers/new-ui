import React from 'react';
import BaseNotice, { type BaseNoticeProps } from './components/BaseNotice/BaseNotice';

export type NoticeVariant = 'base';

export type NoticeProps = { variant: 'base' } & BaseNoticeProps;

const Notice = (props: NoticeProps) => {
    const { variant, ...rest } = props;

    if (variant === 'base') {
        return <BaseNotice {...rest} />;
    }

    return <BaseNotice {...rest} />;
};

export default Notice;
