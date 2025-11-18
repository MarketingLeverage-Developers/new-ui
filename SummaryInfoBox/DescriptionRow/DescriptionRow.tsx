import React from 'react';
import styles from '../SummaryInfoBox.module.scss';

type Props = { icon: string; text: string };

const DescriptionRow = ({ text, icon }: Props) => {
    // URL + 줄바꿈 변환기
    const parseText = (input = ''): (string | React.ReactElement)[] => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        const lines = input.split('\n');

        return lines.flatMap((line, lineIndex) => {
            const processedLine = line.split(urlRegex).map((part, partIndex) => {
                const isUrl = /^(https?:\/\/[^\s]+)$/.test(part);
                if (isUrl) {
                    return (
                        <a
                            key={`url-${lineIndex}-${partIndex}`}
                            href={part}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.LinkText}
                        >
                            {part}
                        </a>
                    );
                }
                return part;
            });

            if (lineIndex < lines.length - 1) {
                return [...processedLine, <br key={`br-${lineIndex}`} />];
            }

            return processedLine;
        });
    };

    return (
        <div className={styles.Row}>
            <img src={icon} alt="" className={styles.DescriptionIcon} />
            <div>{text ? parseText(text) : '없음'}</div>
        </div>
    );
};

export default DescriptionRow;
