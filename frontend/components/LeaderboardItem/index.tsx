import React from 'react';
import styles from './LeaderboardItem.module.css';

interface LeaderboardItemProps {
  rank: number;
  username: string;
  score: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  rank,
  username,
  score,
  avatar,
  isCurrentUser = false,
}) => {
  return (
    <div className={`${styles.item} ${isCurrentUser ? styles.currentUser : ''}`}>
      <div className={styles.rank}>{rank}</div>
      <div className={styles.user}>
        <div className={styles.avatar}>
          {avatar ? (
            <img src={avatar} alt={username} />
          ) : (
            <div className={styles.defaultAvatar}>
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className={styles.username}>{username}</div>
      </div>
      <div className={styles.score}>{score}</div>
    </div>
  );
};

export default LeaderboardItem; 