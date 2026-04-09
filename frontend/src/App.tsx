import React, { useState } from 'react';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://concrete-slab-calculator-cq87.onrender.com/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slabLength: 5000,
          thickness: 200,
          elasticity: 30000,
          poissonRatio: 0.2,
          numElements: 20
        })
      });
      const data = await response.json();
      setResults(data.data);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🏗️ Concrete Slab Calculator</h1>
        <p>FEM-based Structural Analysis Tool</p>
      </header>
      
      <main className="app-main">
        <div className="container">
          <div className="input-section">
            <h2>Configuration</h2>
            <button onClick={handleCalculate} disabled={loading}>
              {loading ? 'Calculating...' : 'Calculate'}
            </button>
          </div>
          
          <div className="results-section">
            {results && (
              <div>
                <h2>Results</h2>
                <p><strong>Max Moment:</strong> {results.maxMoment?.toFixed(2)} kN·m</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
