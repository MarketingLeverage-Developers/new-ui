import React from 'react';

type Item = {
    id: string;
    lable: string;
    required: boolean;
    href: string;
};

type ItemProps = {
    Items: Item;
};

const Item = ({ Item }: ItemProps) => <div></div>;

export default Item;
