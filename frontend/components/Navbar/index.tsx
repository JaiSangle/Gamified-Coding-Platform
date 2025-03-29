import React from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          <span>Gamified Learning</span>
        </Link>
      </div>
      <ul className={styles.navLinks}>
        <li>
          <Link href="/">
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link href="/challenges">
            <span>Challenges</span>
          </Link>
        </li>
        <li>
          <Link href="/leaderboard">
            <span>Leaderboard</span>
          </Link>
        </li>
        <li>
          <Link href="/profile">
            <span>Profile</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar; 