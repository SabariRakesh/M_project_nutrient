import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';


const Dashboard = () => {
  const navigate = useNavigate();
  const [foodData, setFoodData] = useState({
    foodName: '',
    size: 'medium',
    quantity: 1,
    image: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFoodData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    setFoodData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://6tbid4o9l4.execute-api.eu-north-1.amazonaws.com/prod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          food_name: foodData.foodName, 
          size: foodData.size 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch nutrition data');
      }

      const nutrientData = await response.json();
      
      // Navigate to food details page with the data
      navigate('/food-details', { 
        state: { 
          nutrientData,
          foodImage: foodData.image ? URL.createObjectURL(foodData.image) : null,
          quantity: foodData.quantity
        } 
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    
    <div className={styles.dashboard}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingContent}>
            <img src="/note-noted.gif" alt="Loading..." className={styles.loadingGif} />
            <p>Analyzing...</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className={styles.errorMessage}>
          <p>Error: {error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          <img src="/logo.jpg" alt="Health Tracker Logo" />
        </div>
        
        <nav className={styles.navbar}>
          <ul>
            <li onClick={() => navigate('/login')}>Login</li>
            <li onClick={() => navigate('/user-history')}>User History</li>
            <li onClick={() => navigate('/about')}>About</li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <div className={styles.foodFormContainer}>
          <h2>Track Your Food Intake</h2>
          
          <form onSubmit={handleSubmit} className={styles.foodForm}>
            {/* Image Upload */}
            <div className={styles.formGroup}>
              <label htmlFor="foodImage">Upload Food Image</label>
              <input 
                type="file" 
                id="foodImage" 
                accept="image/*" 
                onChange={handleImageUpload}
                className={styles.fileInput}
              />
              {foodData.image && (
                <div className={styles.imagePreview}>
                  <img 
                    src={URL.createObjectURL(foodData.image)} 
                    alt="Food preview" 
                    className={styles.previewImage}
                  />
                </div>
              )}
            </div>

            {/* Food Name */}
            <div className={styles.formGroup}>
              <label htmlFor="foodName">Food Name</label>
              <input
                type="text"
                id="foodName"
                name="foodName"
                value={foodData.foodName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Size Selection */}
            <div className={styles.formGroup}>
              <label htmlFor="size">Size</label>
              <select
                id="size"
                name="size"
                value={foodData.size}
                onChange={handleChange}
                required
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            {/* Quantity */}
            <div className={styles.formGroup}>
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={foodData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Submit Food Details'}
            </button>
          </form>
        </div>
      </main>
    </div>
    
  );
};

export default Dashboard;