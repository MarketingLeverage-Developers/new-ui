import classNames from 'classnames';
import SingleDatePicker, { type SingleDatePickerProps } from '../SingleDatePicker/SingleDatePicker';
import styles from './FullWidthSingleDatePicker.module.scss';

export type FullWidthSingleDatePickerProps = SingleDatePickerProps;

const FullWidthSingleDatePicker = ({ className, ...props }: FullWidthSingleDatePickerProps) => (
    <SingleDatePicker className={classNames(styles.Root, className)} {...props} />
);

export default FullWidthSingleDatePicker;
