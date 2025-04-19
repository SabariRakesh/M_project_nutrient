import React, { useEffect, useState } from 'react';
import styles from './SuggestionsPage.module.css';
import { recommendFoods } from '../utils/greedyRecommender';
import foodList from '../data/foods.json';

const RDI = {
  "Energy": 2000,
  "Protein": 50,
  "Carbohydrate, by difference": 300,
  "Fiber, total dietary": 30,
  "Total lipid (fat)": 70,
  "Total Sugars": 50,
  "Sodium, Na": 2300
};

const SuggestionsPage = () => {
  const [deficiencies, setDeficiencies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [numDays, setNumDays] = useState(0);

  useEffect(() => {
    fetchFoodHistory();
  }, []);

  const fetchFoodHistory = async () => {
    try {
      const response = await fetch('https://2yek7wb68j.execute-api.eu-north-1.amazonaws.com/prod/food-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user123' }),
      });

      const data = await response.json();
      const daysCount = getDistinctDates(data);
      setNumDays(daysCount);

      const deficienciesFound = calculateNutrientDeficiencies(data, daysCount);
      setDeficiencies(deficienciesFound);

      const topFoods = recommendFoods(deficienciesFound, foodList);
      setRecommendations(topFoods);
    } catch (error) {
      console.error('Error fetching food history:', error);
    }
  };

  const getDistinctDates = (data) => {
    const days = new Set();
    data.forEach(item => {
      const date = new Date(item.timestamp * 1000);
      const dayStr = date.toISOString().split("T")[0];
      days.add(dayStr);
    });
    return days.size;
  };

  const calculateNutrientDeficiencies = (data, numberOfDays) => {
    const totals = {};

    data.forEach(entry => {
      for (const [nutrient, value] of Object.entries(entry.nutrients)) {
        if (RDI[nutrient]) {
          totals[nutrient] = (totals[nutrient] || 0) + value;
        }
      }
    });

    const deficiencies = [];

    for (const [nutrient, rdi] of Object.entries(RDI)) {
      const intake = totals[nutrient] || 0;
      const totalRDI = rdi * numberOfDays;
      const percentage = ((intake / totalRDI) * 100).toFixed(0);

      if (intake < totalRDI * 0.7) {
        deficiencies.push({
          name: nutrient,
          intake: intake.toFixed(1),
          rdi: totalRDI,
          percentage
        });
      }
    }

    return deficiencies;
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>💡 Suggestions</h2>

      <h3 className={styles.subheading}>Deficiency Summary</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nutrient</th>
            <th>Avg Intake</th>
            <th>RDI</th>
            <th>% of RDI</th>
          </tr>
        </thead>
        <tbody>
          {deficiencies.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.intake}</td>
              <td>{item.rdi}</td>
              <td>{item.percentage}% ⚠️</td>
            </tr>
          ))}
        </tbody>
      </table>

      {recommendations.length > 0 && (
        <>
          <h3 className={styles.subheading}>Recommended Foods</h3>
          <ul className={styles.recommendations}>
            {recommendations.map((food, index) => (
              <li key={index} className={styles.foodCard}>
                <strong>{food.food}</strong> <br />
                (Score: {food.score})<br />
                Covers: {food.nutrientsCovered.map(n => n.nutrient).join(", ")}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default SuggestionsPage;
