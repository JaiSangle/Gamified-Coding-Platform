import React from 'react';
import Head from 'next/head';
import ChallengeCard from '../components/ChallengeCard';
import styles from '../styles/Demo.module.css';

const DemoChallengeCard: React.FC = () => {
  const handleStartChallenge = (title: string) => {
    alert(`Starting challenge: ${title}`);
  };

  const challenges = [
    {
      id: 1,
      title: 'JavaScript Fundamentals',
      description: 'Learn the basics of JavaScript including variables, data types, functions, and control flow structures. This challenge will help you build a solid foundation in JavaScript programming.',
      difficulty: 'easy' as const,
    },
    {
      id: 2,
      title: 'React Component Lifecycle',
      description: 'Understand how React components work under the hood. Learn about component mounting, updating, and unmounting phases and how to use lifecycle methods effectively.',
      difficulty: 'medium' as const,
    },
    {
      id: 3,
      title: 'Advanced Algorithms',
      description: 'Tackle complex algorithmic problems that will test your problem-solving skills. Learn about dynamic programming, graph algorithms, and optimization techniques.',
      difficulty: 'hard' as const,
    }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Challenge Card Demo</title>
        <meta name="description" content="Demo of the ChallengeCard component" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Challenge Card Component</h1>
        
        <p className={styles.description}>
          Below are examples of the ChallengeCard component with different difficulty levels
        </p>

        <div className={styles.grid}>
          {challenges.map(challenge => (
            <div key={challenge.id} className={styles.card}>
              <ChallengeCard
                title={challenge.title}
                description={challenge.description}
                difficulty={challenge.difficulty}
                onStart={() => handleStartChallenge(challenge.title)}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DemoChallengeCard; 