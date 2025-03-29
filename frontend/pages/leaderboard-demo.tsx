import React from 'react';
import Head from 'next/head';
import Leaderboard from '../components/Leaderboard';
import styles from '../styles/LeaderboardDemo.module.css';

const LeaderboardDemo: React.FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Leaderboard Component Demo</title>
        <meta name="description" content="Demo of the Leaderboard component" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Leaderboard Component</h1>
        
        <p className={styles.description}>
          A responsive component that fetches and displays user rankings
        </p>

        <div className={styles.leaderboardWrapper}>
          <Leaderboard />
        </div>
      </main>
    </div>
  );
};

export default LeaderboardDemo; 