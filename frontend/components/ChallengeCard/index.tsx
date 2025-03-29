import React from 'react';
import styles from './ChallengeCard.module.css';

interface ChallengeCardProps {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  onStartChallenge?: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  title,
  description,
  difficulty,
  onStartChallenge
}) => {
  const getDifficultyLabel = (difficulty: string) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  return (
    <div className={styles.challengeCard}>
      <div className={`${styles.cardHeader} ${styles[difficulty]}`}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <span className={`${styles.difficultyBadge} ${styles[`${difficulty}Badge`]}`}>
          {getDifficultyLabel(difficulty)}
        </span>
      </div>
      
      <div className={styles.cardContent}>
        <p className={styles.description}>{description}</p>
      </div>
      
      <div className={styles.cardFooter}>
        <button 
          className={styles.startButton}
          onClick={onStartChallenge}
          aria-label={`Start ${title} challenge`}
        >
          Start Challenge
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard; 