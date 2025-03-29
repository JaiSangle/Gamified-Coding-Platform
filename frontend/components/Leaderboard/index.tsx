import React, { useState, useEffect } from 'react';
import styles from './Leaderboard.module.css';
import api from '../../services/api';

interface User {
  id: string;
  username: string;
  score: number;
  rank: number;
  avatar?: string;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFrame, setTimeFrame] = useState<string>('all');

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        const data = await api.leaderboard.getAll(timeFrame);
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
        setError('Failed to load leaderboard data. Please try again later.');
        
        // Fallback data for development
        setUsers([
          { id: '1', username: 'codeMaster', score: 9850, rank: 1 },
          { id: '2', username: 'devNinja', score: 8720, rank: 2 },
          { id: '3', username: 'learnerPro', score: 7600, rank: 3 },
          { id: '4', username: 'algoExpert', score: 6450, rank: 4 },
          { id: '5', username: 'webWizard', score: 5890, rank: 5 },
          { id: '6', username: 'codeExplorer', score: 4760, rank: 6 },
          { id: '7', username: 'techLearner', score: 3950, rank: 7 },
          { id: '8', username: 'dataDriven', score: 3240, rank: 8 },
          { id: '9', username: 'frontendMaster', score: 2680, rank: 9 },
          { id: '10', username: 'reactRookie', score: 1920, rank: 10 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [timeFrame]);

  const handleTimeFrameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeFrame(e.target.value);
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className={styles.leaderboardContainer}>
      <div className={styles.leaderboardHeader}>
        <h2 className={styles.leaderboardTitle}>Top Performers</h2>
        <div className={styles.filterControls}>
          <select 
            className={styles.timeFrameSelect} 
            value={timeFrame} 
            onChange={handleTimeFrameChange}
            aria-label="Select time period"
          >
            <option value="all">All Time</option>
            <option value="monthly">This Month</option>
            <option value="weekly">This Week</option>
            <option value="daily">Today</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading leaderboard data...</p>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <p>{error}</p>
          <button 
            className={styles.retryButton} 
            onClick={() => setTimeFrame(timeFrame)}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.leaderboardTable}>
            <thead>
              <tr>
                <th className={styles.rankColumn}>Rank</th>
                <th className={styles.userColumn}>User</th>
                <th className={styles.scoreColumn}>Score</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className={styles.userRow}>
                  <td className={styles.rankCell}>
                    <div className={`${styles.rankBadge} ${
                      user.rank === 1 ? styles.firstPlace :
                      user.rank === 2 ? styles.secondPlace :
                      user.rank === 3 ? styles.thirdPlace : ''
                    }`}>
                      {user.rank}
                    </div>
                  </td>
                  <td className={styles.userCell}>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={`${user.username}'s avatar`} 
                            className={styles.avatarImage} 
                          />
                        ) : (
                          <div className={styles.defaultAvatar}>
                            {user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <span className={styles.username}>{user.username}</span>
                    </div>
                  </td>
                  <td className={styles.scoreCell}>
                    {formatNumber(user.score)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard; 