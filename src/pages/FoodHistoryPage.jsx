import React, { useEffect, useState } from 'react';
import { fetchFoodHistory } from '../services/api';
import './FoodHistoryPage.css';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { useUser } from '../context/UserContext';

const FoodHistoryPage = () => {
  const [foodHistory, setFoodHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useUser();

  const [selectedNutrients, setSelectedNutrients] = useState([
    'Total lipid (fat)', 'Protein', 'Carbohydrate, by difference',
    'Fiber, total dietary', 'Total Sugars', 'Iron, Fe',
    'Calcium, Ca', 'Vitamin A', 'Vitamin C', 'Sodium', 'Energy'
  ]);

  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        const now = Math.floor(Date.now() / 1000);
        const oneMonthAgo = now - 30 * 24 * 60 * 60;
        console.log("Id in history : " ,userId)
        const data = await fetchFoodHistory(userId, oneMonthAgo, now);
        setFoodHistory(data.sort((a, b) => b.timestamp - a.timestamp));
      } catch (error) {
        console.log(error);
        setError('Error loading food history');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]); // ✅ add userId here to refetch on change

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getUnit = (nutrient) => {
    if (nutrient === 'Energy') return 'kcal';
    return ['Iron, Fe', 'Calcium, Ca'].includes(nutrient) ? 'mg' : 'g';
  };

  const getValue = (item, nutrient) => {
    return item.nutrients?.[nutrient] !== undefined
      ? item.nutrients[nutrient].toFixed(1)
      : '0.0';
  };

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  const totalData = {
    labels: selectedNutrients,
    datasets: [{
      label: 'Total Intake',
      data: selectedNutrients.map(nutrient =>
        foodHistory.reduce((sum, item) => sum + (item.nutrients[nutrient] || 0), 0)
      ),
      backgroundColor: '#33c3ff'
    }]
  };

  const avgData = {
    labels: selectedNutrients,
    datasets: [{
      label: 'Average Daily Intake',
      data: selectedNutrients.map(nutrient =>
        (
          foodHistory.reduce((sum, item) => sum + (item.nutrients[nutrient] || 0), 0) /
          (foodHistory.length || 1)
        ).toFixed(1)
      ),
      backgroundColor: '#75ff33'
    }]
  };

  const handleNutrientFilterChange = (nutrient) => {
    setSelectedNutrients((prev) =>
      prev.includes(nutrient)
        ? prev.filter(n => n !== nutrient)
        : [...prev, nutrient]
    );
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="food-history-wrapper">
      <div className="top-bar">
  <button className="suggestion-button" onClick={() => window.location.href = '/suggestions'}>
    💡 Get Food Suggestions
  </button>
</div>
      <h1 className="title">🍽️ Food History</h1>
       
      {/* Nutrient Filter */}
      <div className="filter-container">
        <h3>Choose Nutrients to Display</h3>
        <div className="filter-grid">
          {[
            'Total lipid (fat)', 'Protein', 'Carbohydrate, by difference',
            'Fiber, total dietary', 'Total Sugars', 'Iron, Fe',
            'Calcium, Ca', 'Vitamin A', 'Vitamin C', 'Sodium', 'Energy'
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

      {/* Charts */}
      <div className="charts">
        <div className="chart">
          <h3>Total Nutrient Intake - {currentMonth}</h3>
          <Bar data={totalData} options={{ responsive: true }} />
        </div>
        <div className="chart">
          <h3>Average Daily Intake</h3>
          <Bar data={avgData} options={{ responsive: true }} />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="food-history-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Food</th>
              <th>Timestamp</th>
              {selectedNutrients.map(n => (
                <th key={n}>{n}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {foodHistory.map(item => (
              <tr key={item.id}>
                <td><img src={item.imageURL} alt={item.foodName} className="food-img" /></td>
                <td>{item.foodName}</td>
                <td>{formatTimestamp(item.timestamp)}</td>
                {selectedNutrients.map(n => (
                  <td key={n}>{getValue(item, n)} {getUnit(n)}</td>
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
