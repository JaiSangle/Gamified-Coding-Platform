import React from 'react';
import Head from 'next/head';
import LeaderboardItem from '../components/LeaderboardItem';
import styles from '../styles/Leaderboard.module.css';

// Sample leaderboard data (would come from an API in a real app)
const sampleLeaderboard = [
  {
    id: 1,
    username: 'codeMaster',
    score: 8750,
    avatar: '',
  },
  {
    id: 2,
    username: 'learnerPro',
    score: 7500,
    avatar: '',
  },
  {
    id: 3,
    username: 'devNinja',
    score: 6200,
    avatar: '',
  },
  {
    id: 4,
    username: 'webWizard',
    score: 5800,
    avatar: '',
  },
  {
    id: 5,
    username: 'currentUser', // This would be the logged-in user
    score: 4500,
    avatar: '',
  },
  {
    id: 6,
    username: 'codeNewbie',
    score: 3200,
    avatar: '',
  },
  {
    id: 7,
    username: 'algoExpert',
    score: 2800,
    avatar: '',
  },
];

const Leaderboard: React.FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Leaderboard | Gamified Learning Platform</title>
        <meta name="description" content="See the top performers in our learning platform" />
      </Head>

      <h1 className={styles.title}>Leaderboard</h1>
      
      <div className={styles.filters}>
        <select className={styles.filter}>
          <option>All Time</option>
          <option>This Month</option>
          <option>This Week</option>
        </select>
        
        <input
          type="text"
          placeholder="Search username..."
          className={styles.search}
        />
      </div>
      
      <div className={styles.leaderboard}>
        {sampleLeaderboard.map((user, index) => (
          <LeaderboardItem
            key={user.id}
            rank={index + 1}
            username={user.username}
            score={user.score}
            avatar={user.avatar}
            isCurrentUser={user.username === 'currentUser'}
          />
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;