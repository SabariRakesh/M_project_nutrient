const RDI = {
    "Energy": 2000, // in kcal
    "Protein": 50,
    "Carbohydrate": 300,
    "Fiber": 30,
    "Fat": 70,
    "Sugars": 50,
    "Sodium": 2300
  };
  
  export const recommendFoods = (deficiencies, foodList) => {
    const recommendations = foodList.map(food => {
      let score = 0;
      const nutrientsCovered = [];
  
      deficiencies.forEach(def => {
        const nutrientKey = normalizeKey(def.name); // Ensure naming consistency
        if (food[nutrientKey]) {
          const percentage = (food[nutrientKey] / (RDI[nutrientKey] || 1)) * 100;
          if (percentage > 0) {
            score += percentage;
            nutrientsCovered.push({ nutrient: def.name, percentage });
          }
        }
      });
     //console.log(food)
      return {
        ...food,
        score: Math.round(score),
        nutrientsCovered
      };
    });
  
    return recommendations
      .filter(f => f.nutrientsCovered.length > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Top 5 foods
  };
  
  const normalizeKey = (key) => {
    const mapping = {
      "Carbohydrate, by difference": "Carbohydrate",
      "Fiber, total dietary": "Fiber",
      "Total lipid (fat)": "Fat",
      "Total Sugars": "Sugars",
      "Sodium, Na": "Sodium"
    };
    return mapping[key] || key;
  };
  