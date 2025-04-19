import React from 'react';
import { useLocation } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './FoodDetails.module.css';
import { useUser } from '../context/UserContext';  // Import useUser hook

const COLORS = {
  Fat: '#e74c3c',
  Protein: '#2ecc71',
  Carbs: '#3498db',
  Fiber: '#6433ff',
  Sugar: '#f1c40f',
  Iron: '#e67e22',
  Calcium: '#8e44ad',
};

const FoodDetails = () => {
  const { state } = useLocation();
  const { nutrientData = {}, foodImage, quantity = 1 } = state || {};
  const nutrients = nutrientData.nutrients || {};

  const { userId } = useUser();  // Access userId from context

  const getValue = (key) => {
    return nutrients[key] ? nutrients[key] * quantity : 0;
  };

  const pieData = [
    { name: 'Fat', value: getValue('Total lipid (fat)') },
    { name: 'Protein', value: getValue('Protein') },
    { name: 'Carbs', value: getValue('Carbohydrate, by difference') },
    { name: 'Fiber', value: getValue('Fiber, total dietary') },
    { name: 'Sugar', value: getValue('Total Sugars') },
    { name: 'Iron', value: getValue('Iron, Fe') },
    { name: 'Calcium', value: getValue('Calcium, Ca') },
  ];

  const renderColor = (entry) => COLORS[entry.name] || '#ccc';

  const getNutrientValue = (key, unit = '') => {
    if (!nutrients || !nutrients[key]) return `N/A ${unit}`;
    return `${(nutrients[key] * quantity).toFixed(2)} ${unit}`;
  };

  const handleStoreInDB = async () => {
    const foodData = {
      userId: userId,  // Use userId from context
      foodName: nutrientData.food || 'Unknown Food',
      nutrients: nutrientData.nutrients,
      quantity: quantity,
      imageURL: foodImage,
    };
    console.log(userId);
    try {
      const response = await fetch("https://uhiq7ice7i.execute-api.eu-north-1.amazonaws.com/prod/store-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body: JSON.stringify(foodData) }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Food details stored successfully!");
      } else {
        toast.error(result.message || "Failed to store food details");
      }
    } catch (error) {
      toast.error("Error storing food details: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Nutritional Information</h2>

      <div className={styles.foodHeader}>
        <h3>{nutrientData.food || 'Unknown Food'}</h3>
        <p>Serving Size: {nutrientData.serving_size || 'N/A'}</p>
        <p>Quantity: {quantity}</p>
      </div>

      {foodImage && (
        <div className={styles.foodImageContainer}>
          <img src={foodImage} alt="Food" className={styles.foodImage} />
        </div>
      )}

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={renderColor(entry)} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className={styles.nutrientGrid}>
        <div className={styles.nutrientCard}><h3>Calories</h3><p>{getNutrientValue('Energy', 'kcal')}</p></div>
        <div className={styles.nutrientCard}><h3>Protein</h3><p>{getNutrientValue('Protein', 'g')}</p></div>
        <div className={styles.nutrientCard}><h3>Carbohydrates</h3><p>{getNutrientValue('Carbohydrate, by difference', 'g')}</p></div>
        <div className={styles.nutrientCard}><h3>Fat</h3><p>{getNutrientValue('Total lipid (fat)', 'g')}</p></div>
        <div className={styles.nutrientCard}><h3>Fiber</h3><p>{getNutrientValue('Fiber, total dietary', 'g')}</p></div>
        <div className={styles.nutrientCard}><h3>Sugar</h3><p>{getNutrientValue('Total Sugars', 'g')}</p></div>
        <div className={styles.nutrientCard}><h3>Iron</h3><p>{getNutrientValue('Iron, Fe', 'mg')}</p></div>
        <div className={styles.nutrientCard}><h3>Calcium</h3><p>{getNutrientValue('Calcium, Ca', 'mg')}</p></div>
      </div>

      <button onClick={handleStoreInDB} className={styles.storeButton}>
        Store in DB
      </button>

      <div className={styles.additionalInfo}>
        <h4>Additional Nutrients:</h4>
        <ul>
          <li>Iron: {getNutrientValue('Iron, Fe', 'mg')}</li>
          <li>Calcium: {getNutrientValue('Calcium, Ca', 'mg')}</li>
          <li>Vitamin C: {getNutrientValue('Vitamin C, total ascorbic acid', 'mg')}</li>
          <li>Vitamin A: {getNutrientValue('Vitamin A, RAE', 'mcg')}</li>
        </ul>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default FoodDetails;
