// CheckBoxDropdown/Display/Display.tsx
import React from 'react';
import styles from './Display.module.scss';
import classNames from 'classnames';
import { useManySelect } from '@/shared/headless/ManySelect/ManySelect';

type DisplayProps = React.HTMLAttributes<HTMLDivElement> & {
    placeholder: string;
    render?: (value: string[]) => React.ReactNode;
};

const Display = ({ placeholder, render, className, ...props }: DisplayProps) => {
    const { manySelectValue } = useManySelect();
    const isEmpty = !manySelectValue || manySelectValue.length === 0;

    const displayValue = isEmpty ? placeholder : render ? render(manySelectValue) : manySelectValue.join(', ');

    return (
        <div {...props} className={classNames(styles.Display, className, { [styles.Placeholder]: isEmpty })}>
            {displayValue}
        </div>
    );
};

export default Display;
