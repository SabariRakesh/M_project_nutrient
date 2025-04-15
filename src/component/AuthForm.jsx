import React, { useState } from 'react';
import styles from './AuthForm.module.css';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = () => {
    if (formData.name.trim() && formData.password.trim()) {
      navigate('/dashboard');
    } else {
      alert('Please fill in both Name and Password fields.');
    }
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.formContainer} ${isSignup ? styles.signupMode : ''}`}>
        {/* Login Form */}
        <div className={`${styles.form} ${styles.loginForm}`}>
          <h2>Login</h2>
          <input 
            type="text" 
            name="name"
            placeholder="name" 
            value={formData.email}
            onChange={handleChange}
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={formData.password}
            onChange={handleChange}
          />
          <button onClick={handleLogin}>Login</button>

        </div>

        {/* Signup Form */}
        <div className={`${styles.form} ${styles.signupForm}`}>
          <h2>Sign Up</h2>
          <input 
            type="text" 
            name="name"
            placeholder="Full Name" 
            value={formData.name}
            onChange={handleChange}
          />
          <input 
            type="number" 
            name="age"
            placeholder="Age" 
            value={formData.age}
            onChange={handleChange}
            min="1"
          />
          <input 
            type="number" 
            name="weight"
            placeholder="Weight (kg)" 
            value={formData.weight}
            onChange={handleChange}
            min="1"
            step="0.1"
          />
          <input 
            type="number" 
            name="height"
            placeholder="Height (cm)" 
            value={formData.height}
            onChange={handleChange}
            min="1"
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={formData.password}
            onChange={handleChange}
          />
          <input 
            type="password" 
            name="confirmPassword"
            placeholder="Confirm Password" 
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button>Sign Up</button>
        </div>

        {/* Overlay */}
        <div className={styles.overlayContainer}>
          <div className={styles.overlay}>
            <div className={`${styles.overlayPanel} ${styles.overlayLeft}`}>
              <h2>Welcome Back!</h2>
              <p>Already have an account?</p>
              <button 
                className={styles.ghost} 
                onClick={() => setIsSignup(false)}
              >
                Login
              </button>
            </div>
            <div className={`${styles.overlayPanel} ${styles.overlayRight}`}>
              <h2>Hello, Friend!</h2>
              <p>Start your fitness journey with us</p>
              <button 
                className={styles.ghost} 
                onClick={() => setIsSignup(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;