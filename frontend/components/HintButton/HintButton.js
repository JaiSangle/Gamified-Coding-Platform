import React, { useState } from 'react';
import api from '../../services/api';
import styles from './HintButton.module.css';

/**
 * Component for requesting and displaying hints for challenges
 * 
 * @param {Object} props
 * @param {string} props.challengeId - ID of the current challenge
 * @param {string} props.code - Current code in the editor
 * @param {string} props.language - Programming language of the code
 */
const HintButton = ({ challengeId, code, language = 'javascript' }) => {
  const [hint, setHint] = useState('');
  const [hintLevel, setHintLevel] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Request a hint from the API
  const requestHint = async () => {
    if (!challengeId) {
      setError('Challenge ID is required');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await api.hints.getHint(challengeId, code, hintLevel, language);
      
      if (response.success) {
        setHint(response.data.hint);
        setShowHint(true);
      } else {
        setError(response.error || 'Failed to get hint');
      }
    } catch (err) {
      setError('Error fetching hint. Please try again.');
      console.error('Hint error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Reset hint state
  const resetHint = () => {
    setHint('');
    setShowHint(false);
  };

  // Increment hint level (max 3)
  const incrementHintLevel = () => {
    setHintLevel(prev => Math.min(prev + 1, 3));
    resetHint();
  };

  return (
    <div className={styles.hintContainer}>
      <div className={styles.hintControls}>
        <div className={styles.hintLevelSelector}>
          <span>Hint Level: </span>
          <div className={styles.hintLevels}>
            {[1, 2, 3].map(level => (
              <button
                key={level}
                className={`${styles.levelButton} ${level === hintLevel ? styles.activeLevel : ''}`}
                onClick={() => { setHintLevel(level); resetHint(); }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          className={styles.hintButton}
          onClick={requestHint}
          disabled={loading}
        >
          {loading ? 'Loading...' : `Get Hint ${hintLevel}`}
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
      
      {showHint && hint && (
        <div className={styles.hintDisplay}>
          <div className={styles.hintHeader}>
            <h4>Hint Level {hintLevel}</h4>
            <button 
              className={styles.closeButton}
              onClick={resetHint}
            >
              ×
            </button>
          </div>
          <p className={styles.hintText}>{hint}</p>
          {hintLevel < 3 && (
            <button 
              className={styles.nextHintButton}
              onClick={incrementHintLevel}
            >
              Need more help? Get next hint
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HintButton; 