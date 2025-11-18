import React from 'react';
import styles from './SummaryInfoBox.module.scss';
import SizeRow from './SizeRow/SizeRow';
import BasicRow from './BasicRow/BasicRow';
import DescriptionRow from './DescriptionRow/DescriptionRow';
import Header from './Header/Header';
import Content from './Content/Content';
import DurationRow from './DurationRow/DurationRow';
import LinksRow from './LinksRow/LinksRow';
import LogoRow from './FileRow/FileRow';

const SummaryInfoBox = ({ children }: { children: React.ReactNode }) => (
    <div className={styles.SummaryInfoBox}>{children}</div>
);

export default SummaryInfoBox;

SummaryInfoBox.Header = Header;
SummaryInfoBox.Content = Content;
SummaryInfoBox.BasicRow = BasicRow;
SummaryInfoBox.SizeRow = SizeRow;
SummaryInfoBox.DescriptionRow = DescriptionRow;
SummaryInfoBox.DurationRow = DurationRow;
SummaryInfoBox.LinkRow = LinksRow;
SummaryInfoBox.LogoRow = LogoRow;
