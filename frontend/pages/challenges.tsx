import React from 'react';
import Head from 'next/head';
import ChallengeCard from '../components/ChallengeCard';
import styles from '../styles/Challenges.module.css';

// Sample challenge data (would come from an API in a real app)
const sampleChallenges = [
  {
    id: 1,
    title: 'JavaScript Basics',
    description: 'Learn the fundamentals of JavaScript programming language.',
    difficulty: 'easy',
    points: 100,
  },
  {
    id: 2,
    title: 'React Components',
    description: 'Master the art of creating reusable React components.',
    difficulty: 'medium',
    points: 200,
  },
  {
    id: 3,
    title: 'Advanced Algorithms',
    description: 'Tackle complex algorithmic problems and optimize solutions.',
    difficulty: 'hard',
    points: 300,
  },
  {
    id: 4,
    title: 'CSS Layouts',
    description: 'Create responsive layouts using modern CSS techniques.',
    difficulty: 'medium',
    points: 150,
  },
];

const Challenges: React.FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Challenges | Gamified Learning Platform</title>
        <meta name="description" content="Browse and complete learning challenges" />
      </Head>

      <h1 className={styles.title}>Available Challenges</h1>
      
      <div className={styles.filters}>
        <select className={styles.filter}>
          <option>All Difficulties</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        
        <select className={styles.filter}>
          <option>Sort by Latest</option>
          <option>Sort by Points (High to Low)</option>
          <option>Sort by Points (Low to High)</option>
        </select>
      </div>
      
      <div className={styles.challenges}>
        {sampleChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            title={challenge.title}
            description={challenge.description}
            difficulty={challenge.difficulty as 'easy' | 'medium' | 'hard'}
            points={challenge.points}
            onClick={() => console.log(`Clicked on challenge ${challenge.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Challenges; 