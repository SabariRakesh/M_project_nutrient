import React, { useState } from 'react';
import styles from './AuthForm.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';  // Import the useUser hook

const AuthForm = () => {
  const navigate = useNavigate();
  const { setUserId } = useUser();  // Access setUserId from context

  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    password: '',
    confirmPassword: ''
  });

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post('https://jco78qenpe.execute-api.eu-north-1.amazonaws.com/prod/signup', {
        name: formData.name.trim(),
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        password: formData.password
      });

      if (response.status === 200) {
        alert('Signup successful');

        // Assuming the API returns the userId in response data
        const { userId } = response.data;
        setUserId(userId);  // Store userId in context

        navigate('/dashboard');  // Redirect to dashboard after successful signup
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  const handleLogin = async () => {
    if (formData.name.trim() && formData.password.trim()) {
      try {
        const response = await axios.post('https://qdvmicf8vl.execute-api.eu-north-1.amazonaws.com/prod/signin', {
          name: formData.name.trim(),
          password: formData.password
        });
  
        console.log('Response:', response);  // Log the full response to check data
  
        if (response.status === 200) {
          alert('Login successful');
  
          // Check if response.data contains the expected userId
          const { userId } = response.data;
          if (userId) {
            setUserId(userId);  // Store userId in context
            navigate('/dashboard');  // Redirect to dashboard after successful login
          } else {
            alert('User ID not found in response');
          }
        } else {
          alert(response.data?.message || 'Login failed');
        }
      } catch (error) {
        console.error('Error:', error);  // Log the full error object to understand its structure
        if (error.response) {
          alert(error.response?.data?.message || 'An error occurred. Please try again.');
        } else {
          alert('Network error or API is down. Please try again later.');
        }
      }
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
            placeholder="Name" 
            value={formData.name}
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
          <button onClick={handleSignup}>Sign Up</button>
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
