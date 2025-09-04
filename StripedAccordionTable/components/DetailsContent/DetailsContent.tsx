import classNames from 'classnames';
import React from 'react';
import styles from './DetailsContent.module.scss';

type DetailsContentProps = {} & React.HTMLAttributes<HTMLDivElement>;

const DetailsContent = ({ ...props }: DetailsContentProps) => (
    <div {...props} className={classNames(styles.props, styles.DetailsContent)}>
        {props.children}
    </div>
);

export default DetailsContent;
