import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Gamified Learning Platform</title>
        <meta name="description" content="Learn through gamification" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className={styles.hero}>
        <h1 className={styles.title}>Welcome to Gamified Learning</h1>
        <p className={styles.description}>
          Learn new skills, complete challenges, and climb the leaderboard.
        </p>
        <div className={styles.actions}>
          <Link href="/challenges">
            <button className="btn">Start Learning</button>
          </Link>
          <Link href="/leaderboard">
            <button className="btn btn-outline">View Leaderboard</button>
          </Link>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.feature}>
          <h2>Interactive Challenges</h2>
          <p>Engage with fun, interactive challenges designed to enhance learning.</p>
        </div>
        <div className={styles.feature}>
          <h2>Track Progress</h2>
          <p>Monitor your learning journey and see your improvement over time.</p>
        </div>
        <div className={styles.feature}>
          <h2>Compete with Friends</h2>
          <p>Challenge your friends and climb the leaderboard together.</p>
        </div>
      </section>
    </div>
  );
};

export default Home; 