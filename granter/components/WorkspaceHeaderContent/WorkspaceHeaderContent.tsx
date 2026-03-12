import React from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi2';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { MdOutlineRefresh } from 'react-icons/md';
import agentLogo from '../../assets/agent-logo.svg';
import styles from './WorkspaceHeaderContent.module.scss';

const noop = () => undefined;

export type WorkspaceHeaderContentProps = {
    title: string;
    dateLabel: string;
    onBack?: () => void;
    onPrevDate?: () => void;
    onNextDate?: () => void;
    onRefresh?: () => void;
    onSupportClick?: () => void;
    onAiClick?: () => void;
};

const WorkspaceHeaderContent = ({
    title,
    dateLabel,
    onBack = noop,
    onPrevDate = noop,
    onNextDate = noop,
    onRefresh = noop,
    onSupportClick = noop,
    onAiClick = noop,
}: WorkspaceHeaderContentProps) => (
    <div className={styles.Content}>
        <div className={styles.Left}>
            <button type="button" className={styles.CircleButton} onClick={onBack} aria-label="뒤로가기">
                <IoIosArrowBack size={18} />
            </button>
            <div className={styles.Title}>{title}</div>
        </div>

        <div className={styles.Center}>
            <div className={styles.DateRangeControl}>
                <button type="button" className={styles.DateEdgeButton} onClick={onPrevDate} aria-label="이전 기간">
                    <IoIosArrowBack size={15} />
                </button>
                <div className={styles.DateLabelButton}>
                    <span className={styles.DateLabel}>{dateLabel}</span>
                </div>
                <button type="button" className={styles.DateEdgeButton} onClick={onNextDate} aria-label="다음 기간">
                    <IoIosArrowForward size={15} />
                </button>
            </div>

            <button type="button" className={styles.IconButton} onClick={onRefresh} aria-label="새로고침">
                <MdOutlineRefresh size={20} />
            </button>
        </div>

        <div className={styles.Right}>
            <button type="button" className={styles.SupportButton} onClick={onSupportClick}>
                <span>고객지원</span>
                <HiOutlineChevronDown size={16} />
            </button>

            <button type="button" className={styles.AskButton} onClick={onAiClick}>
                <img src={agentLogo} alt="" aria-hidden="true" className={styles.AgentIcon} />
                <span>AI에 질문</span>
            </button>
        </div>
    </div>
);

export default WorkspaceHeaderContent;
