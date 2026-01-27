import React from 'react';
import Dropdown from '@/shared/headless/Dropdown/Dropdown';
import HeadlessSelect from '@/shared/headless/Select/Select';

export type BaseSelectExtraProps = {
    className?: string;
};

export type BaseSelectProps = React.ComponentProps<typeof HeadlessSelect> & BaseSelectExtraProps;

const BaseSelect: React.FC<BaseSelectProps> = ({ ...props }) => (
    <Dropdown>
        <HeadlessSelect {...props} />
    </Dropdown>
);

export default BaseSelect;
