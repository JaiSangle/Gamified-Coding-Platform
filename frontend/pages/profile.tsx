import React from 'react';
import Head from 'next/head';
import styles from '../styles/Profile.module.css';

// Sample user data (would come from an API/auth system in a real app)
const sampleUser = {
  username: 'currentUser',
  fullName: 'User Name',
  email: 'user@example.com',
  joinDate: 'January 15, 2023',
  score: 4500,
  rank: 5,
  completedChallenges: 32,
  inProgressChallenges: 3,
  badges: [
    { id: 1, name: 'First Challenge', description: 'Completed your first challenge', icon: '🏆' },
    { id: 2, name: 'JavaScript Pro', description: 'Completed all JavaScript challenges', icon: '🔰' },
    { id: 3, name: 'Consistent Learner', description: 'Logged in for 30 consecutive days', icon: '🎯' },
  ],
  recentActivity: [
    { id: 1, type: 'challenge', name: 'JavaScript Basics', date: '2 days ago', points: 100 },
    { id: 2, type: 'badge', name: 'JavaScript Pro', date: '4 days ago', points: 50 },
    { id: 3, type: 'challenge', name: 'CSS Layouts', date: '1 week ago', points: 150 },
  ],
};

const Profile: React.FC = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>My Profile | Gamified Learning Platform</title>
        <meta name="description" content="View and manage your learning profile" />
      </Head>

      <div className={styles.header}>
        <div className={styles.avatar}>
          <div className={styles.defaultAvatar}>
            {sampleUser.username.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className={styles.userInfo}>
          <h1>{sampleUser.fullName}</h1>
          <p className={styles.username}>@{sampleUser.username}</p>
          <p className={styles.joinDate}>Member since {sampleUser.joinDate}</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{sampleUser.score}</span>
            <span className={styles.statLabel}>Points</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>#{sampleUser.rank}</span>
            <span className={styles.statLabel}>Rank</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{sampleUser.completedChallenges}</span>
            <span className={styles.statLabel}>Completed</span>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Badges</h2>
          <div className={styles.badges}>
            {sampleUser.badges.map((badge) => (
              <div key={badge.id} className={styles.badge}>
                <div className={styles.badgeIcon}>{badge.icon}</div>
                <div className={styles.badgeInfo}>
                  <h3>{badge.name}</h3>
                  <p>{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Recent Activity</h2>
          <div className={styles.activity}>
            {sampleUser.recentActivity.map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.activityType}>
                  {activity.type === 'challenge' ? '📝' : '🏆'}
                </div>
                <div className={styles.activityInfo}>
                  <h3>{activity.name}</h3>
                  <p>{activity.date}</p>
                </div>
                <div className={styles.activityPoints}>+{activity.points}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className="btn">Edit Profile</button>
        <button className="btn btn-outline">Logout</button>
      </div>
    </div>
  );
};

export default Profile; 