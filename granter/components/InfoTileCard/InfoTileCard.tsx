import React from 'react';
import { LuLink2Off } from 'react-icons/lu';
import DangerGhostButton from '../Button/DangerGhostButton';
import Text from '../Text/Text';
import styles from './InfoTileCard.module.scss';

const noop = () => undefined;

const getDeltaTone = (delta?: string) => (delta?.trim().startsWith('-') ? 'down' : 'up');

export type InfoTileCardItem = {
    key: string;
    icon: string;
    name: string;
    amount: string;
    delta?: string;
    owner?: string;
    hasLink?: boolean;
};

export type InfoTileCardProps = {
    item: InfoTileCardItem;
    onLinkClick?: (item: InfoTileCardItem) => void;
};

const InfoTileCard = ({ item, onLinkClick = noop }: InfoTileCardProps) => (
    <article className={styles.Tile}>
        <div className={styles.TileLeft}>
            <span className={styles.IconWrap}>
                <img src={item.icon} alt="" />
            </span>

            <span className={styles.Copy}>
                <Text className={styles.Name} tone="muted">
                    {item.name}
                </Text>
                <Text as="span" className={styles.Amount} weight="bold">
                    {item.amount}
                    {item.delta ? (
                        <Text as="em" className={styles.Delta} tone="inherit" data-tone={getDeltaTone(item.delta)}>
                            {item.delta}
                        </Text>
                    ) : null}
                </Text>
            </span>
        </div>

        <div className={styles.TileRight}>
            {item.owner ? (
                <Text as="span" className={styles.OwnerAvatar} tone="inherit" weight="semibold">
                    {item.owner}
                </Text>
            ) : null}
            {item.hasLink ? (
                <DangerGhostButton
                    size="icon-wide"
                    aria-label="연결"
                    className={styles.LinkButton}
                    leftIcon={<LuLink2Off size={16} />}
                    onClick={() => onLinkClick(item)}
                />
            ) : null}
        </div>
    </article>
);

export default InfoTileCard;
