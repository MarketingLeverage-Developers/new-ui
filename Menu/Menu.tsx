import React from 'react';
import styles from './Menu.module.scss';
import { ExpandableItem, InnerItem, Item, Label, Section } from './components';

type MenuProps = React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
};

const MenuMain = React.forwardRef<HTMLDivElement, MenuProps>(({ children, className, ...props }, ref) => (
    <div ref={ref} className={`${styles.Menu} ${className ?? ''}`} {...props}>
        {children}
    </div>
));

export const Menu = Object.assign(MenuMain, {
    Section,
    Item,
    ExpandableItem,
    InnerItem,
    Label,
});
