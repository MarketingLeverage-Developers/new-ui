import React from 'react';
import classNames from 'classnames';
import styles from './RoundedTextInput.module.scss';

export type RoundedTextInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
    className?: string;
};

const RoundedTextInput = React.forwardRef<HTMLInputElement, RoundedTextInputProps>(
    ({ className, type = 'text', ...props }, ref) => (
        <input
            ref={ref}
            type={type}
            className={classNames(styles.RoundedTextInput, className)}
            {...props}
        />
    )
);

RoundedTextInput.displayName = 'RoundedTextInput';

export default RoundedTextInput;
