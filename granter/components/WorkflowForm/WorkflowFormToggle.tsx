import CheckboxTextToggle, { type CheckboxTextToggleProps } from '../CheckboxTextToggle/CheckboxTextToggle';
import classNames from 'classnames';
import styles from './WorkflowForm.module.scss';

export type WorkflowFormToggleProps = CheckboxTextToggleProps;

const WorkflowFormToggle = ({ className, ...props }: WorkflowFormToggleProps) => (
    <CheckboxTextToggle className={classNames(styles.Toggle, className)} {...props} />
);

export default WorkflowFormToggle;
