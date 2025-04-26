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
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadStatus, setUploadStatus] = useState(null); // "success" | "error" | null
  const [imageURLS3, setImageURLS3] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false); // New state for submit button

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFoodData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFoodData(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleRemoveImage = () => {
    setFoodData(prev => ({
      ...prev,
      image: null
    }));

    // Resetting file input value manually to ensure "Choose File" text shows
    document.getElementById('foodImage').value = '';
  };

  const handleImageUploadClick = async () => {
    if (!foodData.image) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1];

      const payload = {
        image: base64Image,
        image_name: foodData.image.name
      };

      try {
        setIsLoading(true);

        const uploadResponse = await fetch('https://j0c0ztcen3.execute-api.eu-north-1.amazonaws.com/prod/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const uploadResult = await uploadResponse.json();
        console.log("Upload Result: ", uploadResult);

        if (!uploadResponse.ok) {
          throw new Error(uploadResult.message || 'Upload failed');
        }

        setUploadMessage('Upload successful!');
        setUploadStatus('success');
        setImageURLS3(uploadResult.object_url);

        const predictionResponse = await fetch("https://3c4niu74luz7cwvqwzyy66z64u0jwyxa.lambda-url.eu-north-1.on.aws/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ image_url: uploadResult.object_url })
        });

        const predictionResult = await predictionResponse.json();
        console.log("Prediction Result: ", predictionResult);

        if (!predictionResponse.ok) {
          throw new Error(predictionResult.message || 'Prediction failed');
        }

        setFoodData(prev => ({
          ...prev,
          foodName: (predictionResult.predicted_class_name || '').replace(/_/g, ' ')
        }));
        
      } catch (error) {
        console.error('Error during upload or prediction:', error);
        setUploadMessage(error.message || 'Something went wrong!');
        setUploadStatus('error');
      }

      setIsLoading(false);
      setTimeout(() => {
        setUploadMessage('');
        setUploadStatus(null);
      }, 3000); // Message fades out after 3 seconds
    };

    reader.readAsDataURL(foodData.image);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true); // Show "Analysing..." message
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

      navigate('/food-details', {
        state: {
          nutrientData,
          foodImage: foodData.image ? imageURLS3 : null,
          quantity: foodData.quantity
        }
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitLoading(false); // Hide "Analysing..." message after submission is done
    }
  };

  return (
    <div className={styles.dashboard}>
      {uploadMessage && (
        <div className={`${styles.uploadStatusMessage} ${uploadStatus === 'success' ? styles.uploadSuccess : styles.uploadError}`}>
          {uploadMessage}
        </div>
      )}

      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingContent}>
            <img src="/note-noted.gif" alt="Loading..." className={styles.loadingGif} />
            <p>Predicting...</p>
          </div>
        </div>
      )}

      {submitLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingContent}>
            <img src="/note-noted.gif" alt="Loading..." className={styles.loadingGif} />
            <p>Analysing...</p>
          </div>
        </div>
      )}

      {error && (
        <div className={styles.errorMessage}>
          <p>Error: {error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          <img src="/logo.jpg" alt="Health Tracker Logo" />
        </div>

        <nav className={styles.navbar}>
          <ul>
            <li onClick={() => navigate('/dashboard')}>Dasboard</li>
            <li onClick={() => navigate('/user-history')}>User History</li>
            <li onClick={() => navigate('/about')}>About</li>
            <li onClick={() => navigate('/login')}>Logout</li>
          </ul>
        </nav>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.foodFormContainer}>
          <h2>Track Your Food Intake</h2>

          <form onSubmit={handleSubmit} className={styles.foodForm}>

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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                    <button type="button" className={styles.uploadButton} onClick={handleImageUploadClick} disabled={isLoading}>
                      {isLoading ? 'Uploading...' : 'Upload'}
                    </button>
                    <img
                      src={URL.createObjectURL(foodData.image)}
                      alt="Food preview"
                      className={styles.previewImage}
                    />
                  </div>
                  <span className={styles.closeButton} onClick={handleRemoveImage}>&times;</span>
                </div>
              )}
            </div>

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

            <button
              type="submit"
              className={styles.submitButton}
              disabled={submitLoading}
            >
              {submitLoading ? 'Analysing...' : 'Submit Food Details'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
