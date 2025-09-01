import React from 'react';
import styles from './Menu.module.scss';
import { ExpandableItem, InnerItem, Item, Label, Section } from './components';

type MenuProps = {
    children?: React.ReactNode;
};

export const Menu = ({ children }: MenuProps) => <div className={styles.Menu}>{children}</div>;

Menu.Section = Section;
Menu.Item = Item;
Menu.ExpandableItem = ExpandableItem;
Menu.InnerItem = InnerItem;
Menu.Label = Label;
