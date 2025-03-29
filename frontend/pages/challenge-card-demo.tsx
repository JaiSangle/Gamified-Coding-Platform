import React from 'react';
import Head from 'next/head';
import ChallengeCard from '../components/ChallengeCard';
import styles from '../styles/ChallengeCardDemo.module.css';

const ChallengeCardDemo: React.FC = () => {
  const handleStartChallenge = (challengeName: string) => {
    alert(`Starting challenge: ${challengeName}`);
  };

  const challenges = [
    {
      id: 1,
      title: 'JavaScript Foundations',
      description: 'Master the core concepts of JavaScript including variables, data types, functions, and control structures. This challenge is perfect for beginners looking to build a solid foundation in web development.',
      difficulty: 'easy' as const,
    },
    {
      id: 2,
      title: 'React State Management',
      description: 'Learn how to effectively manage state in React applications. Explore useState, useReducer, Context API, and how to organize your application state for optimal performance and maintainability.',
      difficulty: 'medium' as const,
    },
    {
      id: 3,
      title: 'Advanced Data Structures',
      description: 'Dive deep into complex data structures including trees, graphs, and advanced algorithms. This challenge will help you solve intricate programming problems and optimize your code for performance.',
      difficulty: 'hard' as const,
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Challenge Card Component Demo</title>
        <meta name="description" content="Demo showcase of the Challenge Card component" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Challenge Card Component</h1>
        
        <p className={styles.description}>
          A responsive UI component for displaying learning challenges with different difficulty levels
        </p>

        <div className={styles.grid}>
          {challenges.map((challenge) => (
            <div key={challenge.id} className={styles.cardWrapper}>
              <ChallengeCard
                title={challenge.title}
                description={challenge.description}
                difficulty={challenge.difficulty}
                onStartChallenge={() => handleStartChallenge(challenge.title)}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ChallengeCardDemo; 