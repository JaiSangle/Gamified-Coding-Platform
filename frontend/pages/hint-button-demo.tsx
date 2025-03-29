import React, { useState } from 'react';
import Head from 'next/head';
import HintButton from '../components/HintButton';
import styles from '../styles/Demo.module.css';

// Mock challenge for demo purposes
const mockChallenge = {
  id: 'mock-challenge-123',
  title: 'Fibonacci Sequence',
  description: 'Write a function that returns the nth number in the Fibonacci sequence.',
  difficulty: 'medium',
  language: 'javascript',
};

const HintButtonDemo: React.FC = () => {
  const [code, setCode] = useState(`function fibonacci(n) {
  // Your code here
}`);

  return (
    <div className={styles.container}>
      <Head>
        <title>Hint Button Demo | Gamified Learning Platform</title>
        <meta name="description" content="Demo page for the AI-powered hint button" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>AI Hint Button Demo</h1>
        
        <div className={styles.challengeInfo}>
          <h2>{mockChallenge.title}</h2>
          <p className={styles.description}>{mockChallenge.description}</p>
          <p className={styles.difficulty}>
            Difficulty: <span className={styles.badge}>{mockChallenge.difficulty}</span>
          </p>
        </div>
        
        <div className={styles.codeEditorContainer}>
          <div className={styles.editorHeader}>
            <span>Code Editor</span>
            <span className={styles.language}>{mockChallenge.language}</span>
          </div>
          <textarea
            className={styles.codeEditor}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={10}
            spellCheck={false}
          />
        </div>
        
        <div className={styles.hintSection}>
          <h3>Need help?</h3>
          <HintButton 
            challengeId={mockChallenge.id}
            code={code}
            language={mockChallenge.language}
          />
        </div>
        
        <div className={styles.note}>
          <p>
            <strong>Note:</strong> This is a demo of the AI-powered hint functionality. 
            In a real application, the hints would be generated based on the actual challenge content 
            and user code.
          </p>
        </div>
      </main>
    </div>
  );
};

export default HintButtonDemo; 