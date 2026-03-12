import React, { useState } from 'react';
import { FiClock, FiPaperclip, FiPlus, FiSettings, FiX } from 'react-icons/fi';
import { HiArrowUp } from 'react-icons/hi2';
import styles from './CopilotPanel.module.scss';

export type CopilotPrompt = {
    key: string;
    label: string;
};

export type CopilotPanelProps = {
    title?: string;
    prompts: CopilotPrompt[];
    inputPlaceholder?: string;
    onPickPrompt?: (key: string) => void;
    onRefreshPrompts?: () => void;
    onOpenHistory?: () => void;
    onOpenSettings?: () => void;
    onCreateSession?: () => void;
    onClose?: () => void;
    onAttach?: () => void;
    onSend?: (message: string) => void;
};

const noop = () => undefined;

const CopilotPanel = ({
    title = 'AI에 질문',
    prompts,
    inputPlaceholder = '무엇이든 물어보세요.',
    onPickPrompt = noop,
    onRefreshPrompts = noop,
    onOpenHistory = noop,
    onOpenSettings = noop,
    onCreateSession = noop,
    onClose = noop,
    onAttach = noop,
    onSend = noop,
}: CopilotPanelProps) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        const trimmed = message.trim();

        if (!trimmed) return;

        onSend(trimmed);
        setMessage('');
    };

    return (
        <section className={styles.CopilotPanel} aria-label={title}>
            <header className={styles.Header}>
                <strong className={styles.Title}>{title}</strong>

                <div className={styles.Actions}>
                    <button type="button" className={styles.IconButton} aria-label="닫기" onClick={onClose}>
                        <FiX size={18} />
                    </button>
                    <button type="button" className={styles.IconButton} aria-label="세션 히스토리" onClick={onOpenHistory}>
                        <FiClock size={18} />
                    </button>
                    <button type="button" className={styles.IconButton} aria-label="설정" onClick={onOpenSettings}>
                        <FiSettings size={18} />
                    </button>
                    <button type="button" className={styles.IconButton} aria-label="새 세션" onClick={onCreateSession}>
                        <FiPlus size={18} />
                    </button>
                </div>
            </header>

            <div className={styles.PromptArea}>
                <div className={styles.PromptList}>
                    {prompts.map((prompt) => (
                        <button
                            key={prompt.key}
                            type="button"
                            className={styles.PromptButton}
                            onClick={() => onPickPrompt(prompt.key)}
                        >
                            {prompt.label}
                        </button>
                    ))}
                </div>

                <button type="button" className={styles.RefreshPromptButton} onClick={onRefreshPrompts} aria-label="추천 새로고침">
                    <HiArrowUp size={16} />
                </button>
            </div>

            <footer className={styles.Footer}>
                <div className={styles.InputFrame}>
                    <input
                        type="text"
                        value={message}
                        placeholder={inputPlaceholder}
                        className={styles.Input}
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                handleSend();
                            }
                        }}
                    />

                    <div className={styles.InputActions}>
                        <button type="button" className={styles.SecondaryButton} aria-label="파일 첨부" onClick={onAttach}>
                            <FiPaperclip size={15} />
                        </button>
                        <button
                            type="button"
                            className={styles.SendButton}
                            aria-label="전송"
                            data-disabled={message.trim() ? 'false' : 'true'}
                            disabled={!message.trim()}
                            onClick={handleSend}
                        >
                            <HiArrowUp size={15} />
                        </button>
                    </div>
                </div>
            </footer>
        </section>
    );
};

export default CopilotPanel;
