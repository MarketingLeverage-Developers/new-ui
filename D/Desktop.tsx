import React from 'react';

import { DeleteConfirmModal } from './components/DeleteConfirmModal/DeleteConfirmModal';
import RestoreConfirmModal from './components/RestoreConfirmModal/RestoreConfirmModal';
import Input from './components/Input/Input';
import Label from './components/Label/Label';
import Notice from './components/Notice/Notice';
import Button from './components/Button/Button';
import FileUploader from './components/FileUploader/FileUploader';
import Tab from './components/Tab/Tab';
import Chip from './components/Chip/Chip';
import MultiSelect from './components/MultiSelect/MultiSelect';
import TextArea from './components/TextArea/TextArea';
import MultiTab from './components/MultiTab/MultiTab';
import Rating from './components/Rating/Rating';
import Calendar from './components/Calendar/Calendar';
import Template from './components/Template/Template';
import { DateSelect } from './components/DateSelect/DateSelect';
import { IsDeleteSelect } from './components/IsDeleteSelect/IsDeleteSelect';
import { ListPagination } from './components/ListPagination/ListPagination';
import { ListTable } from './components/ListTable/ListTable';
import { PageSizeSelect } from './components/PageSizeSelect/PageSizeSelect';
import { ModalContainer } from './components/ModalContainer/ModalContainer';

type DesktopProps = {
    children: React.ReactNode;
};

export const Desktop = ({ children }: DesktopProps) => <>{children}</>;

Desktop.DeleteConfirmModal = DeleteConfirmModal;
Desktop.RestoreConfirmModal = RestoreConfirmModal;
Desktop.DateSelect = DateSelect;
Desktop.IsDeleteSelect = IsDeleteSelect;
Desktop.ListPagination = ListPagination;
Desktop.ListTable = ListTable;
Desktop.PageSizeSelect = PageSizeSelect;
Desktop.ModalContainer = ModalContainer;
Desktop.Input = Input;
Desktop.Label = Label;
Desktop.Notice = Notice;
Desktop.Button = Button;
Desktop.FileUploader = FileUploader;
Desktop.Tab = Tab;
Desktop.Chip = Chip;
Desktop.MultiSelect = MultiSelect;
Desktop.TextArea = TextArea;
Desktop.MultiTab = MultiTab;
Desktop.Rating = Rating;
Desktop.Calendar = Calendar;
Desktop.Template = Template;
