import React from 'react';
import classNames from 'classnames';
import styles from './SectionFieldTextArea.module.scss';

export type SectionFieldTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    className?: string;
    variant?: 'default' | 'document' | 'workflow';
};

const SectionFieldTextArea = React.forwardRef<HTMLTextAreaElement, SectionFieldTextAreaProps>(
    ({ className, variant = 'default', ...props }, ref) => (
        <textarea ref={ref} className={classNames(styles.TextArea, className)} data-variant={variant} {...props} />
    )
);

SectionFieldTextArea.displayName = 'SectionFieldTextArea';

export default SectionFieldTextArea;
