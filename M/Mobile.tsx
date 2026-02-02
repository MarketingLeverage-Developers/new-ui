import React from 'react';
import styles from './Mobile.module.scss';
import { ListTable } from './components/ListTable/ListTable';
import { ListInfiniteScroll } from './components/ListInfiniteScroll/ListInfiniteScroll';
import { ListPagination } from './components/ListPagination/ListPagination';
import { PageSizeSelect } from './components/PageSizeSelect/PageSizeSelect';
import { PageTemplate } from './components/Template/components/PageTemplate/PageTemplate';
import Input from './components/Input/Input';
import TextArea from './components/TextArea/TextArea';
import Button from './components/Button/Button';
import Label from './components/Label/Label';
import Notice from './components/Notice/Notice';
import ColorPicker from './components/ColorPicker/ColorPicker';
import Box from './components/Box/Box';
import Chip from './components/Chip/Chip';
import Select from './components/Select/Select';
import Tab from './components/Tab/Tab';
import Text from './components/Text/Text';
import Template from './components/Template/Template';
import { ModalContainer } from './components/ModalContainer/ModalContainer';
import Item from './components/Item/Item';

type MobileProps = {
    children: React.ReactNode;
};

export const Mobile = ({ children }: MobileProps) => <div className={styles.Mobile}>{children}</div>;

Mobile.ListTable = ListTable;
Mobile.ListInfiniteScroll = ListInfiniteScroll;
Mobile.ListPagination = ListPagination;
Mobile.PageSizeSelect = PageSizeSelect;
Mobile.PageTemplate = PageTemplate;

Mobile.Input = Input;
Mobile.TextArea = TextArea;
Mobile.Button = Button;
Mobile.Label = Label;
Mobile.Notice = Notice;
Mobile.ColorPicker = ColorPicker;
Mobile.Box = Box;
Mobile.Chip = Chip;
Mobile.Select = Select;
Mobile.Tab = Tab;
Mobile.Text = Text;
Mobile.Template = Template;
Mobile.ModalContainer = ModalContainer;
Mobile.Item = Item;
