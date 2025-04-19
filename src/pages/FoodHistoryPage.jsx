import React, { useEffect, useState } from 'react';
import { fetchFoodHistory } from '../services/api';
import './FoodHistoryPage.css';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';  // Import Chart.js

const FoodHistoryPage = () => {
  const [foodHistory, setFoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNutrients, setSelectedNutrients] = useState([
    'Total lipid (fat)',
    'Protein',
    'Carbohydrate, by difference',
    'Fiber, total dietary',
    'Total Sugars',
    'Iron, Fe',
    'Calcium, Ca',
    'Vitamin A',
    'Vitamin C',
    'Sodium',
    'Energy',
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const now = Math.floor(Date.now() / 1000);
        const oneMonthAgo = now - 30 * 24 * 60 * 60;

        const data = await fetchFoodHistory('user123', oneMonthAgo, now);
        setFoodHistory(data.sort((a, b) => b.timestamp - a.timestamp));
      } catch (error) {
        setError('Error loading food history');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const getUnit = (nutrient) => {
    if (nutrient === 'Energy') return 'kcal';
    return ['Iron, Fe', 'Calcium, Ca'].includes(nutrient) ? 'mg' : 'g';
  };

  const getValue = (item, nutrientName) => {
    return item.nutrients && item.nutrients[nutrientName] !== undefined
      ? item.nutrients[nutrientName].toFixed(1)
      : '0.0';
  };
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  // Chart Data for Nutrient Intake (Total)
  const totalData = {
    labels: selectedNutrients,
    datasets: [{
      label: 'Total Intake (g)',
      data: selectedNutrients.map(nutrient => 
        foodHistory.reduce((total, item) => total + (item.nutrients[nutrient] || 0), 0)
      ),
      backgroundColor: ['#ff5733', '#33c3ff', '#75ff33', '#ffeb33', '#ff33a1', '#33c300', '#3399ff', '#ff9533', '#a1ff33', '#c0c0c0'],
    }]
  };

  // Chart Data for Average Daily Intake (g)
  const avgData = {
    labels: selectedNutrients,
    datasets: [{
      label: 'Average Daily Intake (g)',
      data: selectedNutrients.map(nutrient => 
        (foodHistory.reduce((total, item) => total + (item.nutrients[nutrient] || 0), 0) / foodHistory.length).toFixed(1)
      ),
      backgroundColor: ['#ff5733', '#33c3ff', '#75ff33', '#ffeb33', '#ff33a1', '#33c300', '#3399ff', '#ff9533', '#a1ff33', '#c0c0c0'],
    }]
  };

  // Filter change handler
  const handleNutrientFilterChange = (nutrient) => {
    setSelectedNutrients((prevState) => {
      if (prevState.includes(nutrient)) {
        return prevState.filter(item => item !== nutrient);
      } else {
        return [...prevState, nutrient];
      }
    });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="food-history-wrapper">
      <h1 className="title">🍽️ Food History</h1>
      
      {/* Filters for Nutrients */}
      <div className="filter-container">
  <h3>Choose Nutrients to Display</h3>
  <div className="filter-grid">
    {[
      'Total lipid (fat)', 'Protein', 'Carbohydrate, by difference',
      'Fiber, total dietary', 'Total Sugars', 'Iron, Fe',
      'Calcium, Ca', 'Vitamin A', 'Vitamin C',
      'Sodium', 'Energy'
    ].map(nutrient => (
      <label key={nutrient} className="filter-item">
        <input
          type="checkbox"
          checked={selectedNutrients.includes(nutrient)}
          onChange={() => handleNutrientFilterChange(nutrient)}
        />
        {nutrient}
      </label>
    ))}
  </div>
</div>


      {/* Nutrient Charts */}
      <div className="charts">
        <div className="chart">
          <h3>Total Nutrient Intake for {currentMonth}</h3>
          <Bar data={totalData} options={{ responsive: true }} />
        </div>
        <div className="chart">
          <h3>Average Daily Intake</h3>
          <Bar data={avgData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Food History Table */}
      <div className="table-container">
        <table className="food-history-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Food</th>
              <th>Timestamp</th>
              {selectedNutrients.map((nutrient) => (
                <th key={nutrient}>{nutrient}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {foodHistory.map((item) => (
              <tr key={item.id}>
                <td><img src={item.imageURL} alt={item.foodName} className="food-img" /></td>
                <td>{item.foodName}</td>
                <td>{formatTimestamp(item.timestamp)}</td>
                {selectedNutrients.map((nutrient) => (
                  <td key={nutrient}>
                    {getValue(item, nutrient)} {getUnit(nutrient)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FoodHistoryPage;
