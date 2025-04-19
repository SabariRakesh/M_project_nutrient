// components/LoadingScreen.jsx
import React from 'react';
import styles from './LoadingScreen.module.css';

const LoadingScreen = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.logoWrapper}>
        <img src="/loading.png" alt="Logo" className={styles.logo} /> {/* Replace with your actual logo path */}
        <h1 className={styles.title}>MealMind</h1>
        {/* <p className={styles.tagline}>Fuel your body right 🍏</p> */}
        <p className={styles.tagline}>Fuel Your Day, The Smart Way 💪🍽️</p>
        
      </div>
    </div>
  );
};

export default LoadingScreen;
