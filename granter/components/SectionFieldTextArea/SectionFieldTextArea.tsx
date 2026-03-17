import React from 'react';
import classNames from 'classnames';
import styles from './SectionFieldTextArea.module.scss';

export type SectionFieldTextAreaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    className?: string;
};

const SectionFieldTextArea = React.forwardRef<HTMLTextAreaElement, SectionFieldTextAreaProps>(
    ({ className, ...props }, ref) => (
        <textarea
            ref={ref}
            className={classNames(styles.TextArea, className)}
            {...props}
        />
    )
);

SectionFieldTextArea.displayName = 'SectionFieldTextArea';

export default SectionFieldTextArea;
