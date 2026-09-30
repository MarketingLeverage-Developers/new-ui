import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import styles from './ErrorFallback.module.scss';

interface ErrorFallbackProps {
    onRetry?: () => void;
    message?: string;
    title?: string;
    variant?: 'page' | 'inline';
}

const TECHNICAL_ERROR_PATTERN = /request failed|status code|network error|timeout|axioserror|\b(?:GET|POST|PUT|PATCH|DELETE)\s+https?:/i;

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
    onRetry,
    message,
    title = '내용을 불러오지 못했어요',
    variant = 'page',
}) => {
    const trimmedMessage = message?.trim();
    const description = trimmedMessage && !TECHNICAL_ERROR_PATTERN.test(trimmedMessage)
        ? trimmedMessage
        : '잠시 후 다시 시도해 주세요.';

    return (
        <div className={styles.Root} data-variant={variant} role="alert">
            <FiAlertCircle className={styles.Icon} aria-hidden="true" />
            <strong className={styles.Title}>{title}</strong>
            <p className={styles.Description}>{description}</p>
            {onRetry ? (
                <button className={styles.RetryButton} type="button" onClick={onRetry}>
                    다시 시도
                </button>
            ) : null}
        </div>
    );
};

export default ErrorFallback;
