import React from 'react';
import styles from './GranterHomePeopleGrid.module.scss';

export type GranterHomePeopleUser = {
    key: string;
    avatar?: React.ReactNode;
    name: React.ReactNode;
    ratio: React.ReactNode;
    amount: React.ReactNode;
};

export type GranterHomePeopleTeam = {
    key: string;
    team: React.ReactNode;
    total: React.ReactNode;
    users: GranterHomePeopleUser[];
};

export type GranterHomePeopleGridProps = {
    teams: GranterHomePeopleTeam[];
};

const GranterHomePeopleGrid = ({ teams }: GranterHomePeopleGridProps) => (
    <div className={styles.PeopleScroller}>
        {teams.map((team) => (
            <article key={team.key} className={styles.TeamCard}>
                <header className={styles.TeamHead}>
                    <strong>{team.team}</strong>
                    <span>{team.total}</span>
                </header>

                <div className={styles.TeamRows}>
                    {team.users.map((user) => (
                        <button key={user.key} type="button" className={styles.TeamUserRow}>
                            <span className={styles.UserAvatar}>
                                {user.avatar ?? (typeof user.name === 'string' ? user.name.slice(0, 1) : '')}
                            </span>
                            <span className={styles.UserName}>{user.name}</span>
                            <span className={styles.UserRatio}>{user.ratio}</span>
                            <strong>{user.amount}</strong>
                        </button>
                    ))}
                </div>
            </article>
        ))}
    </div>
);

export default GranterHomePeopleGrid;
