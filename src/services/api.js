export async function fetchFoodHistory(userId, start, end) {
    const response = await fetch('https://2yek7wb68j.execute-api.eu-north-1.amazonaws.com/prod/food-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, start, end }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch food history');
    }
    
    const res = await response.json();
    console.log("REseponse from api : ",res);
    return res;
  }
  