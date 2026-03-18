import React from 'react';
import classNames from 'classnames';
import styles from './SectionFieldInput.module.scss';

export type SectionFieldInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    className?: string;
};

const SectionFieldInput = React.forwardRef<HTMLInputElement, SectionFieldInputProps>(
    ({ className, type = 'text', ...props }, ref) => (
        <input
            ref={ref}
            type={type}
            className={classNames(styles.Input, className)}
            {...props}
        />
    )
);

SectionFieldInput.displayName = 'SectionFieldInput';

export default SectionFieldInput;
